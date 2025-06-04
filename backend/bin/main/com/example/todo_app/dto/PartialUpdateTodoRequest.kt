package com.example.todo_app.dto

import jakarta.validation.constraints.Size

data class PartialUpdateTodoRequest(
    @field:Size(min = 3, max = 80)
    val title: String?,
    @field:Size(min = 3, max = 180)
    val description: String?,
    val completed: Boolean?
)