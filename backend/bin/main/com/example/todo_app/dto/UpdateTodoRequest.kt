package com.example.todo_app.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class UpdateTodoRequest(
    @field:NotBlank
    @field:Size(min = 3, max = 80)
    val title: String,
    val description: String,
    val completed: Boolean
)