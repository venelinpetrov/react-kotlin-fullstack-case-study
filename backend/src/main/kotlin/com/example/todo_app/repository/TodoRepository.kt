package com.example.todo_app.repository

import com.example.todo_app.model.Todo
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface TodoRepository : CrudRepository<Todo, Long> {
    fun findByCompleted(completed: Boolean): List<Todo>

    @Query("SELECT * FROM todos ORDER BY created_at DESC")
    override fun findAll(): List<Todo>

    fun findByCreatedAtBefore(date: LocalDateTime): List<Todo>
}