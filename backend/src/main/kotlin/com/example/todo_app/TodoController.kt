package com.example.todo_app

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
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
    fun createTodo(@RequestBody todo: Todo): ResponseEntity<Todo> {
        val createdTodo = todoService.createTodo(todo)
        return ResponseEntity.created(URI("/${createdTodo.id}")).body(createdTodo)
    }

    @GetMapping("/{id}")
    fun getTodoById(id: Long): ResponseEntity<Todo> {
        return todoService.findTodoById(id).toResponseEntity()
    }

    @PutMapping("/{id}")
    fun updateTodo(@PathVariable id: Long, @RequestBody todo: UpdateTodoRequest): ResponseEntity<Todo> {
        val existing = todoService.findTodoById(id) ?: return ResponseEntity.notFound().build()

        val updated = existing.copy(
            title = todo.title,
            description = todo.description,
            completed = todo.completed
        )

        val saved = todoService.updateTodo(updated)

        return ResponseEntity.ok(saved)
    }

    private fun Todo?.toResponseEntity(): ResponseEntity<Todo> =
        this?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
}