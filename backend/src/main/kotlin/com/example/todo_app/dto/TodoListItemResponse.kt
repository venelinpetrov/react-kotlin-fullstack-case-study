package com.example.todo_app.dto

data class TodoListItemResponse(
    val id: Long,
    val title: String,
    val completed: Boolean
)
