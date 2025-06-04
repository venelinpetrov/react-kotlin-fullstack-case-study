package com.example.todo_app

import org.springframework.stereotype.Service

@Service
class TodoService(private val todoRepository: TodoRepository) {
    fun getAllTodos(): List<Todo> = todoRepository.findAll().toList()
    fun createTodo(todo: Todo): Todo = todoRepository.save(todo)
}