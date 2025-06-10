package com.example.todo_app.controller

import com.example.todo_app.common.ApiResponse
import com.example.todo_app.common.toSuccessResponse
import com.example.todo_app.common.toSuccessResponseEntity
import com.example.todo_app.dto.CreateTodoRequest
import com.example.todo_app.dto.PartialUpdateTodoRequest
import com.example.todo_app.dto.TodoListItemResponse
import com.example.todo_app.dto.TodoResponse
import com.example.todo_app.dto.UpdateTodoRequest
import com.example.todo_app.exception.NotFoundException
import com.example.todo_app.mapper.toEntity
import com.example.todo_app.mapper.toListItemResponse
import com.example.todo_app.mapper.toResponse
import com.example.todo_app.service.TodoService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.net.URI
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/todos")
class TodoController(private val todoService: TodoService) {
    @GetMapping
    fun getAllTodos(): ResponseEntity<ApiResponse<List<TodoListItemResponse>>> {
        val todos = todoService.getAllTodos().map { it.toListItemResponse() }
        return todos.toSuccessResponseEntity()
    }

    @PostMapping
    fun createTodo(@Valid @RequestBody req: CreateTodoRequest): ResponseEntity<ApiResponse<TodoResponse>> {
        val createdTodo = todoService.createTodo(req.toEntity()).toResponse()
        return ResponseEntity.created(URI("/api/todos/${createdTodo.id}")).body(createdTodo.toSuccessResponse())
    }

    @GetMapping("/{id}")
    fun getTodoById(id: Long): ResponseEntity<ApiResponse<TodoResponse>> {
        val todo = todoService.findTodoById(id) ?: throw NotFoundException("Todo with id $id not found")
        return todo.toResponse().toSuccessResponseEntity()
    }

    @PutMapping("/{id}")
    fun updateTodo(
        @PathVariable id: Long,
        @Valid @RequestBody req: UpdateTodoRequest
    ): ResponseEntity<ApiResponse<TodoResponse>> {
        val existing = todoService.findTodoById(id) ?: throw NotFoundException("Todo with id $id not found")

        val updated = existing.copy(
            title = req.title,
            description = req.description,
            completed = req.completed
        )

        val saved = todoService.updateTodo(updated).toResponse()

        return saved.toSuccessResponseEntity()
    }

    @PatchMapping("/{id}")
    fun patchTodo(
        @PathVariable id: Long,
        @Valid @RequestBody req: PartialUpdateTodoRequest
    ): ResponseEntity<ApiResponse<TodoResponse>> {
        val existing = todoService.findTodoById(id) ?: throw NotFoundException("Todo with id $id not found")

        val updated = existing.copy(
            title = req.title ?: existing.title,
            description = req.description ?: existing.description,
            completed = req.completed ?: existing.completed
        )

        val saved = todoService.updateTodo(updated).toResponse()

        return saved.toSuccessResponseEntity()
    }

    @GetMapping("/before")
    fun getTodosBeforeDate(@RequestParam date: String): ResponseEntity<ApiResponse<List<TodoResponse>>> {
        val parsedDate = LocalDateTime.parse(date)
        val todos = todoService.findTodoBeforeDate(parsedDate).map { it.toResponse() }

        return todos.toSuccessResponseEntity()
    }

    @DeleteMapping("/{id}")
    fun deleteTodoById(@PathVariable id: Long): ResponseEntity<ApiResponse<Void?>> {
        val existing = todoService.findTodoById(id) ?: throw NotFoundException("Todo with $id not found")

        todoService.deleteTodoById(id)

        return ResponseEntity.ok(ApiResponse.success())
    }

    @DeleteMapping("/all")
    fun deleteAllTodos(): ResponseEntity<ApiResponse<Void?>> {
        todoService.deleteAllTodos()

        return ResponseEntity.ok(ApiResponse.success())
    }
}