package com.example.todo_app.service

import com.example.todo_app.model.Todo
import com.example.todo_app.repository.TodoRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class TodoService(private val todoRepository: TodoRepository) {
    fun getAllTodos(): List<Todo> = todoRepository.findAll().toList()
    fun createTodo(todo: Todo): Todo = todoRepository.save(todo)
    fun findTodoById(id: Long): Todo? = todoRepository.findByIdOrNull(id)
    fun updateTodo(todo: Todo): Todo = todoRepository.save(todo)
}