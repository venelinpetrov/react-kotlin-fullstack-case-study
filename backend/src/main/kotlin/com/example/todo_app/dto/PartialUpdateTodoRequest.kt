package com.example.todo_app.dto

data class PartialUpdateTodoRequest(
    val title: String?,
    val description: String?,
    val completed: Boolean?
)