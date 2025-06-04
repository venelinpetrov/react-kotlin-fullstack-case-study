package com.example.todo_app.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateTodoRequest (
    @field:NotBlank
    @field:Size(min = 3, max = 80)
    val title: String,
    val description: String,
)