package com.reshumbrella.config;

import com.alibaba.fastjson2.JSONObject;
import com.reshumbrella.entity.RestBean;
import com.reshumbrella.service.AuthorizeService;
import jakarta.annotation.Resource;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.sql.DataSource;
import java.io.IOException;

/**
 * @author Reshumbrella
 * @version 1.0
 * @description: 安全性校验
 * @date 2023/7/10 16:41
 */
@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    @Resource
    AuthorizeService authorizeService;

    @Resource
    DataSource dataSource;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, PersistentTokenRepository repository) throws Exception {
        return http
                .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .loginProcessingUrl("/api/auth/login")
                .successHandler(this::onAuthenticationSuccess)
                .failureHandler(this::onAuthenticationFailure)
                .and().logout()
                .logoutUrl("/api/auth/logout")
                .and()
                .rememberMe()
                .rememberMeParameter("remember")
                .tokenRepository(repository)
                .tokenValiditySeconds(3600 * 24 * 7)
                .and()
                .csrf().disable()
                .cors()
                .configurationSource(this.corsConfigurationSource())
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(this::onAuthenticationFailure)
                .and()
                .build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cors = new CorsConfiguration();
        cors.addAllowedOriginPattern("http://localhost:3000");
        cors.setAllowCredentials(true);
        cors.addAllowedHeader("*");
        cors.addAllowedMethod("*");
        cors.addExposedHeader("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);
        return source;
    }

    @Bean
    public PersistentTokenRepository tokenRepository() {
        JdbcTokenRepositoryImpl jdbcTokenRepository = new JdbcTokenRepositoryImpl();
        jdbcTokenRepository.setDataSource(dataSource);
        jdbcTokenRepository.setCreateTableOnStartup(false);
        return jdbcTokenRepository;
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity security) throws Exception {
        return security
                .getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(authorizeService)
                .and()
                .build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //登录成功
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        response.setCharacterEncoding("utf-8");
//        返回字符串格式数据
//        response.getWriter().write("登录成功！");
//        返回json格式数据
        response.getWriter().write(JSONObject.toJSONString(RestBean.success("登录成功！", authorizeService.getUserInfo())));
    }

    //登录失败
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        response.setCharacterEncoding("utf-8");
        response.getWriter().write(JSONObject.toJSONString(RestBean.failure(401, exception.getMessage())));
    }
}
