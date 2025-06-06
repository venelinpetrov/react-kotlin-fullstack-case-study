<p align="center">
  <img src="https://spring.io/img/projects/spring-boot.svg" alt="Spring Boot" height="80"/>
  &nbsp;&nbsp;&nbsp;
  <img src="https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.png" alt="Kotlin" width="80"/>
</p>

# Spring Boot / Kotlin Todo app API

This document explains in detail how the Todo app API was made

## Spring Boot

In this section you will find everything related to the Spring Boot setup

### 📦 Dependencies

```kotlin
// build.gradle.kts

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("com.mysql:mysql-connector-j")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.8")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
}
```

**Explanation**:

| Dependency                                                                 | Purpose                                                                 |
|---------------------------------------------------------------------------|-------------------------------------------------------------------------|
| `org.springframework.boot:spring-boot-starter-data-jdbc`                 | Enables Spring Data JDBC support for database interactions.             |
| `org.springframework.boot:spring-boot-starter-web`                       | Provides web and RESTful API capabilities with Spring MVC.              |
| `com.fasterxml.jackson.module:jackson-module-kotlin`                     | Adds support for Jackson JSON serialization/deserialization for Kotlin. |
| `org.jetbrains.kotlin:kotlin-reflect`                                    | Enables Kotlin reflection, required by frameworks like Spring.          |
| `com.mysql:mysql-connector-j`                                            | MySQL JDBC driver for connecting to a MySQL database.                   |
| `org.jetbrains.kotlin:kotlin-stdlib-jdk8`                                | Kotlin standard library for JDK 8.                                       |
| `org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.8`               | Generates Swagger/OpenAPI docs for your REST API.                       |
| `org.springframework.boot:spring-boot-starter-validation`               | Adds support for validation annotations like `@Valid`, `@NotNull`, etc. |
| `org.springframework.boot:spring-boot-starter-test`                     | Testing support including JUnit, Hamcrest, and Mockito.                 |
| `org.jetbrains.kotlin:kotlin-test-junit5`                                | Enables JUnit 5 support for Kotlin tests.                               |
| `org.junit.platform:junit-platform-launcher`                             | Required for launching JUnit 5 tests.                                   |
| `org.springframework.boot:spring-boot-devtools`                         | Provides hot reload and development-time enhancements.                  |


### 📁 Project structure

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


| 📁 Folder                 | 🔍 Purpose |
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

### 🛠️ Configuration

#### MySQL connection

First, we need to configure Spring Boot to connect to our MySQL database by specifying the `url`, `username`, `password`, and the driver class name in the application.properties file:

```bash
# application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/todo_app?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=0000
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

Next, here is the schema for our todos table:

```sql
-- schema.sql

CREATE TABLE IF NOT EXISTS todos (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description VARCHAR(255),
  completed BOOLEAN DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Auditing

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

## 📚 Theory

There are some common and best practices outlined in this section.

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