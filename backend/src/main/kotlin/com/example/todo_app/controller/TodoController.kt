package com.example.todo_app.controller

import com.example.todo_app.dto.CreateTodoRequest
import com.example.todo_app.dto.PartialUpdateTodoRequest
import com.example.todo_app.model.Todo
import com.example.todo_app.service.TodoService
import com.example.todo_app.dto.UpdateTodoRequest
import com.example.todo_app.mapper.toEntity
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.net.URI

@RestController
@RequestMapping("/")
class TodoController(private val todoService: TodoService) {
    @GetMapping
    fun getAllTodos() = ResponseEntity.ok(todoService.getAllTodos())

    @PostMapping
    fun createTodo(@RequestBody req: CreateTodoRequest): ResponseEntity<Todo> {
        val createdTodo = todoService.createTodo(req.toEntity())
        return ResponseEntity.created(URI("/${createdTodo.id}")).body(createdTodo)
    }

    @GetMapping("/{id}")
    fun getTodoById(id: Long): ResponseEntity<Todo> {
        return todoService.findTodoById(id).toResponseEntity()
    }

    @PutMapping("/{id}")
    fun updateTodo(@PathVariable id: Long, @RequestBody req: UpdateTodoRequest): ResponseEntity<Todo> {
        val existing = todoService.findTodoById(id) ?: return ResponseEntity.notFound().build()

        val updated = existing.copy(
            title = req.title,
            description = req.description,
            completed = req.completed
        )

        val saved = todoService.updateTodo(updated)

        return ResponseEntity.ok(saved)
    }

    @PatchMapping("/{id}")
    fun patchTodo(@PathVariable id: Long, @RequestBody req: PartialUpdateTodoRequest): ResponseEntity<Todo> {
        val existing = todoService.findTodoById(id) ?: return ResponseEntity.notFound().build()

        val updated = existing.copy(
            title = req.title ?: existing.title,
            description = req.description ?: existing.description,
            completed = req.completed ?: existing.completed
        )

        val saved = todoService.updateTodo(updated)

        return ResponseEntity.ok(saved)
    }

    private fun Todo?.toResponseEntity(): ResponseEntity<Todo> =
        this?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
}