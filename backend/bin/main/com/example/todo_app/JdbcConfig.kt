package com.example.todo_app

import org.springframework.context.annotation.Configuration
import org.springframework.data.jdbc.repository.config.EnableJdbcAuditing

@Configuration
@EnableJdbcAuditing
class JdbcConfig