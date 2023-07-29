package com.reshumbrella.entity;

import lombok.Data;

import java.util.Map;

/**
 * @author Reshumbrella
 * @version 1.0
 * @description: 登录状态返回
 * @date 2023/7/10 22:17
 */
@Data
public class RestBean<T> {
    private int status;
    private String state;
    private boolean success;
    private T message;
    private Map<?,?> info;

    private RestBean(int status,String state, boolean success, T message,Map<?,?> info) {
        this.status = status;
        this.state=state;
        this.success = success;
        this.message = message;
        this.info = info;
    }

    public static <T> RestBean<T> success() {
        return new RestBean<>(200,"success",true,null,null);
    }
    public static <T> RestBean<T> success(T message,Map<?,?> info) {
        return new RestBean<>(200,"success",true,message,info);
    }
    public static <T> RestBean<T> failure(int status) {
        return new RestBean<>(status,"error", false,null,null);
    }
    public static <T> RestBean<T> failure(int status,T message) {
        return new RestBean<>(status,"error", false,message,null);
    }
}
