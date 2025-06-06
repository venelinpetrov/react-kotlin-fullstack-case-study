# Notes

Some notes while developing the Todo app

## Spring

In this section you will find everything related to Spring setup

### Project structure

```
src/main/kotlin/com/example/todo_app/
├── common/
│   └── ApiResponse.kt
│   └── ApiResponseExtensions.kt
├── config/
│   └── JdbcAuditingConfig.kt
├── controller/
│   └── TodoController.kt
├── dto/
│   ├── CreateTodoRequest.kt
│   ├── UpdateTodoRequest.kt
│   ├── TodoResponse.kt
│   └── PartialUpdateTodoRequest.kt
├── exception/
│   └── GlobalExceptionHandler.kt
│   └── NotFoundException.kt
├── mapper/
│   └── TodoMapper.kt
├── model/
│   └── Todo.kt
├── repository/
│   └── TodoRepository.kt
├── service/
│   └── TodoService.kt
└── TodoAppApplication.kt
```

**Explanation**:


| Folder                  | Purpose |
|-------------------------|---------|
| `common/`               | Contains general-purpose utilities and shared classes used across multiple layers. For example: `ApiResponse` and extensions for consistent API wrapping. |
| `config/`               | Holds Spring configuration classes such as auditing, CORS, or other custom setup beans. |
| `controller/`           | Defines the web layer (HTTP endpoints). Handles incoming requests and delegates to services. |
| `dto/`                  | Contains Data Transfer Objects used for input/output in the controller layer (e.g., request and response bodies). |
| `exception/`            | Centralized error handling classes. Includes custom exceptions and the global `@ControllerAdvice` to standardize error responses. |
| `mapper/`               | Houses functions that convert between entities and DTOs (e.g., domain-to-response, request-to-entity). |
| `model/`                | Contains domain entities (e.g., `Todo`) that represent database tables and business data. |
| `repository/`           | Interfaces for data access, typically extending Spring Data interfaces (e.g., `CrudRepository`). |
| `service/`              | Business logic layer. Encapsulates data access, validation, and use-case logic. Called by controllers. |
| `TodoAppApplication.kt` | The main Spring Boot entry point (`@SpringBootApplication`). Starts the application. |

## Configuration


### Auditing

The `@EnableJdbcAuditing`annotation is part of Spring Data JDBC, and it's used to enable auditing features in your application. Auditing is the process of automatically capturing and populating metadata such as:

- Created date
- Last modified date
- Created by
- Last modified by

What does `@EnableJdbcAuditing` do?
When you add @EnableJdbcAuditing to a Spring configuration class, it:

- Activates auditing support for Spring Data JDBC repositories.
- Registers necessary infrastructure beans (like AuditingEntityCallback) to automatically populate auditing fields.
- Looks for specific annotations in your entities to mark fields for auditing (see below).

```kotlin
// JdbcAuditingConfig.kt

@Configuration
@EnableJdbcAuditing
class JdbcAuditingConfig
```

```kotlin
// Todo.kt

@Table("todos")
data class Todo(
    @Id val id: Long? = null,
    val title: String,
    val description: String,
    val completed: Boolean = false,

    @CreatedDate // <-- Auditing field
    @Column("created_at")
    val createdAt: LocalDateTime? = null,

    @LastModifiedDate // <-- Auditing field
    @Column("updated_at")
    val updatedAt: LocalDateTime? = null
)
```

## Theory

### DTO vs Model (a.k.a Entity)

**Model** - The actual business object, typically mapped to a database table. This is you _internal_ full representation of your data that often contains all fileds - even internal ones like `id`, `createdAt`, etc. We use the Model for business logic and data persistance

**Example**

```kotlin
@Table("todos")
data class Todo(
    @Id val id: Long? = null,
    val title: String,
    val description: String,
    val completed: Boolean = false,
    val createdAt: LocalDateTime? = null,
    val updatedAt: LocalDateTime? = null
)
```

**DTO** - A lightweight object used for transferring data between layers or over the network. Another way to put it, this is a simplified or shaped version of your model. We used it to send data to/from clients, not for DB persistance. It often contains only the fields you want to expose

**Example**

```kotlin
data class CreateTodoRequest(
    val title: String,
    val description: String
)
```