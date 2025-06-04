package com.example.todo_app.mapper

import com.example.todo_app.dto.CreateTodoRequest
import com.example.todo_app.model.Todo

fun CreateTodoRequest.toEntity(): Todo {
    return Todo(
        title = this.title,
        description = this.description,
        completed = false
    )
}