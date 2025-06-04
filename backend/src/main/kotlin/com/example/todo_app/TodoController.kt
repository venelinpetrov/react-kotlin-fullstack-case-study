package com.example.todo_app

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.net.URI

@RestController
@RequestMapping("/")
class TodoController(private val todoService: TodoService) {
    @GetMapping
    fun getAllTodos() = ResponseEntity.ok(todoService.getAllTodos())

    @PostMapping
    fun createTodo(todo: Todo): ResponseEntity<Todo> {
        val createdTodo = todoService.createTodo(todo)
        return ResponseEntity.created(URI("/${createdTodo.id}")).body(createdTodo)
    }
}