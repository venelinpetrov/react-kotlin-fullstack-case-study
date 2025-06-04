package com.example.todo_app.config

import org.springframework.context.annotation.Configuration
import org.springframework.data.jdbc.repository.config.EnableJdbcAuditing

@Configuration
@EnableJdbcAuditing
class JdbcAuditingConfig