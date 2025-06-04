package com.example.todo_app.mapper

import com.example.todo_app.common.ApiResponse
import com.example.todo_app.dto.CreateTodoRequest
import com.example.todo_app.dto.TodoResponse
import com.example.todo_app.model.Todo
import org.springframework.http.ResponseEntity

fun CreateTodoRequest.toEntity(): Todo {
    return Todo(
        title = this.title,
        description = this.description,
        completed = false
    )
}

fun Todo.toResponse(): TodoResponse {
    return TodoResponse(
        id = this.id!!,
        title = this.title,
        description = this.description,
        completed = this.completed,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt
    )
}
