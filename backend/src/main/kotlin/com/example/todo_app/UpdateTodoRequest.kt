package com.example.todo_app

data class UpdateTodoRequest(
    val title: String,
    val description: String,
    val completed: Boolean
)