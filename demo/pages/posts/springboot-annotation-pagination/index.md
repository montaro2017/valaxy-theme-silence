---
layout: post
title: SpringBoot使用注解进行分页
date: 2025-10-17 16:21:58
toc: true
top: true
---

分页使用可以说非常普遍了，有时候会需要非常灵活的方式去开启或关闭分页，尝试使用一下注解的方式来进行分页。

## 依赖安装

需要使用的依赖：

- Mybatis-Plus
- PageHelper
- SpringBoot AOP

添加pom依赖

```xml [pom.xml]
<!-- Mybatis-Plus -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.4.3.4</version>
</dependency>
<!-- 分页 -->
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.4.0</version>
</dependency>
<!-- AOP -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
    <version>2.5.5</version>
</dependency>
```

## 添加公共返回实体类

需要两种实体类，一种是不分页直接返回数据的，另一种是分页返回数据和总数据条数的

### 普通实体类 AjaxResult

```java [AjaxResult.java]
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AjaxResult<T> {

    public static final int CODE_SUCCESS = 200;
    public static final int CODE_UNAUTHORIZED = 401;
    public static final int CODE_FORBIDDEN = 403;
    public static final int CODE_ERROR = 500;

    public static final String MSG_SUCCESS = "操作成功";
    public static final String MSG_FAILED = "操作失败";
    public static final String MSG_NOT_PERMISSION = "用户权限不足";
    public static final String MSG_UNAUTHORIZED = "用户未登录或身份已过期";

    private int code;
    private String msg;
    private T data;

    public static <T> AjaxResult success(int code, T data) {
        return new AjaxResult(code, MSG_SUCCESS, data);
    }

    public static <T> AjaxResult success(T data) {
        return success(CODE_SUCCESS, data);
    }

    public static AjaxResult success() {
        return success(CODE_SUCCESS, null);
    }

    public static AjaxResult error(int code, String msg) {
        return new AjaxResult(code, msg, null);
    }

    public static AjaxResult error(String msg) {
        return error(CODE_ERROR, msg);
    }

    public static AjaxResult error() {
        return new AjaxResult(CODE_ERROR, MSG_FAILED, null);
    }

}
```

### 分页实体类 PageResult

继承AjaxResult，额外添加total、pageNo和pageSize等字段

```java {4-6}
@Data
public class PageResult extends AjaxResult {

    private long total;
    private long pageNo;
    private long pageSize;

    public PageResult() {
        this.setCode(CODE_SUCCESS);
        this.setMsg(MSG_SUCCESS);
    }

    public PageResult(AjaxResult ajaxResult) {
        this();
        if (Objects.nonNull(ajaxResult)) {
            setCode(ajaxResult.getCode());
            setMsg(ajaxResult.getMsg());
        }
    }
}
```

## 注解处理

### 分页注解 Pagination

创建一个用于分页的注解Pagination
其实这里的pageNo和pageSize没什么需求的话可以去掉的

```java
/**
 * 分页注解
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Pagination {

    // 第几页的请求参数名称 通过获取参数名称获取真正的pageNo
    String pageNo() default "pageNo";
    // 分页大小的请求参数名称
    String pageSize() default "pageSize";

}

```

### 使用AOP进行分页

创建一个类用于处理分页注解，切入点要根据自己注解进行修改

```java
@Aspect
@Component
@Slf4j
public class PaginationAspect {

    /**
     * 定义切入点
     */
    @Pointcut("@annotation(cn.montaro.social.aspect.annotation.Pagination)")
    public void access() {

    }

    @SneakyThrows
    @Around("access()")
    public Object around(ProceedingJoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        Pagination pagination = getPaginationAnnotation(joinPoint);
        startPage(pagination.pageNo(), pagination.pageSize());
        // 调用原本方法的内容并获取返回值
        Object result = joinPoint.proceed(args);
        // 返回的数据类型要保证和注解方法上的一致
        return pageResult(result);
    }

    /**
     * 获取Pagination注解
     *
     * @param joinPoint
     * @return
     */
    public Pagination getPaginationAnnotation(ProceedingJoinPoint joinPoint) {
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        Method method = methodSignature.getMethod();
        Pagination pagination = method.getAnnotation(Pagination.class);
        return pagination;
    }

    /**
     * 开始分页
     */
    private void startPage(String pageNoParameterName, String pageSizeParameterName) {
        // 获取pageNo和pageSize
        int pageNo = ServletUtils.getParameterToInt(pageNoParameterName, 1);
        int pageSize = ServletUtils.getParameterToInt(pageSizeParameterName, 10);
        PageHelper.startPage(pageNo, pageSize);
    }

    /**
     * 对分页结果进行包装 如果分页成功则会返回PageResult
     *
     * @param result
     */
    private Object pageResult(Object result) {
        /**
         * 如果分页成功，则查询返回的结应该是一个Page {@link com.github.pagehelper.Page}
         * 进行一次强制转换就能获取到 total、pageNo、pageSize 这些字段
         */
        PageInfo pageInfo = null;
        AjaxResult ajaxResult = null;
        // 列表数据 如果方法返回Page则直接使用 如果是AjaxResult则getData再封装
        Object list = null;
        if (result instanceof Page) {
            list = result;
            Page page = (Page) result;
            pageInfo = new PageInfo(page);
        } else if (result instanceof AjaxResult) {
            ajaxResult = (AjaxResult) result;
            Object data = ajaxResult.getData();
            if (data instanceof List) {
                list = data;
                pageInfo = new PageInfo((List) data);
            }
        }
        if (pageInfo != null) {
            PageResult pageResult = new PageResult(ajaxResult);
            pageResult.setData(list);
            pageResult.setPageNo(pageInfo.getPageNum());
            pageResult.setPageSize(pageInfo.getPageSize());
            pageResult.setTotal(pageInfo.getTotal());

            return pageResult;
        }
        return result;
    }
}
```

还有注解中使用到的ServletUtils

```java
public class ServletUtils {

    public static HttpServletRequest getRequest() {
        ServletRequestAttributes requestAttributes = getRequestAttributes();
        return requestAttributes.getRequest();
    }

    public static ServletRequestAttributes getRequestAttributes() {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        return (ServletRequestAttributes) requestAttributes;
    }

    public static Integer getParameterToInt(String parameterName, Integer defaultValue) {
        HttpServletRequest request = getRequest();
        String strValue = request.getParameter(parameterName);
        Integer intValue = Convert.toInt(strValue, defaultValue);
        return intValue;
    }

    public static Integer getParameterToInt(String parameterName) {
        return getParameterToInt(parameterName, null);
    }

}
```

## 使用注解

为了避免跑题，此处就省略mybatis-plus的使用了。
需要分页就加上@Pagination注解就行了，不需要就注释掉，代码完全不需要修改
分页的时候传入pageNo和pageSize参数就可以了，如果参数名需要更改，就修改@Pagination就可以了

### 编写Controller类

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private IUserService userService;

    /**
     * 列出所有用户
     * @return
     */
    @Pagination
    @GetMapping("/list")
    public AjaxResult list(UserQueryReq query) {
        List<User> userList = userService.selectUserListByQuery(query);
        return AjaxResult.success(userList);
    }

}

```

### 测试

使用的Postman测试查看效果
使用注解的时候
![image](https://img2020.cnblogs.com/blog/2084018/202110/2084018-20211016221445783-637814575.png)

把注解注释掉
![image](https://img2020.cnblogs.com/blog/2084018/202110/2084018-20211016221410736-29520865.png)

效果可以说非常完美了！

> 博主也是菜鸟一枚，如果有什么问题欢迎留言互相讨论。
