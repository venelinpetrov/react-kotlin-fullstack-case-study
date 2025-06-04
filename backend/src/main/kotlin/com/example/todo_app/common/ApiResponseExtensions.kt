package com.example.todo_app.common

import org.springframework.http.ResponseEntity

fun <T> T.toSuccessResponse(): ApiResponse<T> = ApiResponse.success(this)

fun <T> T.toSuccessResponseEntity(): ResponseEntity<ApiResponse<T>> =
    ResponseEntity.ok(ApiResponse.success(this))