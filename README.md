# Fullstack app with Kotlin Spring Boot and React

A scalable foundation for larger applications, with every component explained in detail below.

## Backend - Spring Boot / Kotlin Todo app API

<p align="center">
  <img src="https://spring.io/img/projects/spring-boot.svg" alt="Spring Boot" height="80"/>
  &nbsp;&nbsp;&nbsp;
  <img src="https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.png" alt="Kotlin" width="80"/>
</p>

This document explains in detail how the Todo app API was made

![alt text](image-1.png)

<h2><img src="https://spring.io/img/projects/spring-boot.svg" alt="Spring Boot" height="16"/> Spring Boot </h2>

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

#### Debugging

Some logging features that can come in handy while developing and debugging

```bash
# Debug

logging.level.org.springframework.jdbc.core=DEBUG
logging.level.org.springframework.jdbc.core.StatementCreatorUtils=TRACE

logging.level.org.springframework.web=DEBUG
logging.level.org.springframework.web.filter.CommonsRequestLoggingFilter=DEBUG
```


#### Exception handling

Why use a `GlobalExceptionHandler` at all?

The purpose of `@ControllerAdvice` with a `GlobalExceptionHandler` is to:

- Provide user-friendly responses (instead of raw stack traces or HTML error pages). This way all responses look consistent, making frontend handling simpler
- Return appropriate HTTP status codes (e.g., 400, 404, 422, etc.)
- The global handler catches exceptions and returns structured `ApiResponse` with `success=false`
- Avoid leaking sensitive info in error messages
- Still log or inspect full stack traces as needed internally
- You keep your controller code clean and focused on happy path logic

Best practice:

You should explicitly handle common client-side errors like `MethodArgumentNotValidException` (400 validation failure), `HttpMessageNotReadableException` (400 malformed JSON), `EntityNotFoundException` (404 Not found). For truly unexpected or internal errors (e.g. `NullPointerException`, `SQLException`), you should let them bubble up or catch with a generic fallback (but log them and return a 500).

Note on `@ControllerAdvice`

In a Spring Boot application, `@ControllerAdvice` is a powerful annotation that allows you to handle exceptions globally, rather than catching them in each individual controller. It acts as an interceptor of exceptions thrown by methods annotated with @RequestMapping (or its variants like @GetMapping, @PostMapping, etc).

This helps you separate error-handling logic from your controller code and ensures consistent HTTP responses for errors.

## 📚 Theory

There are some common and best practices outlined in this section.

### How it all works together

In a typical Spring Boot application, we use controllers, services, and repositories to structure the application according to the MVC (Model-View-Controller) and layered architecture principles. These components interact in the following manner:

1. The `Controller` receives an HTTP request (e.g. `GET /api/todos`)
2. It delegates to a `Service` method (e.g. `getAllTodos`)
3. The `Service` fetches data using a `Repository` (e.g. `findAll`), applies business rules or transformations
4. The result is returned back up the chain - from the service to the controller - which returns it in the HTTP response


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

<h2><img src="https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.png" alt="Kotlin" width="16"/> Kotlin</h2>

This section highlights some key Kotlin idioms and patterns used throughout the codebase.

#### Extension functions

Kotlin extension functions allow us to add functionality to existing classes without modifying their source code. They're used heavily in this app for clean conversion between layers, such as DTO ↔ Entity mappings and response formatting.

```kotlin
fun CreateTodoRequest.toEntity(): Todo { ... }

fun Todo.toResponse(): TodoResponse { ... }
```

#### Companion objects

Companion objects in Kotlin are used to define static-like members within a class - such as constants or factory methods  -  without needing to instantiate the class.

In this project, the `ApiResponse` class uses a companion object to define convenient factory methods for success and error responses:

```kotlin
data class ApiResponse<T>(
    val success: Boolean,
    val data: T? = null,
    val error: String? = null
) {
    companion object {
        fun <T> success(data: T): ApiResponse<T> =
            ApiResponse(success = true, data = data)

        fun <T> failure(message: String): ApiResponse<T> =
            ApiResponse(success = false, data = null, error = message)
    }
}
```

#### Data classes

Kotlin’s data class automatically provides `equals`, `hashCode`, `toString`, and `copy` methods - perfect for DTOs and immutable-like domain models.

Used for modeling request and response payloads cleanly:

```kotlin
data class CreateTodoRequest(
    val title: String,
    val description: String
)

data class TodoResponse(
    val id: Long,
    val title: String,
    val description: String,
    val completed: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
```

Also used elegantly in partial updates via `.copy()`:

```kotlin
val updated = existing.copy(
    title = req.title ?: existing.title,
    ...
)
```

#### Null safety

Kotlin enforces null safety at the language level, reducing the chance of runtime `NullPointerExceptions`.

You can see this in how `findTodoById` safely returns a nullable value:

```kotlin
fun findTodoById(id: Long): Todo? = todoRepository.findByIdOrNull(id)
```

And then is explicitly checked in the controller:

```kotlin
val todo = todoService.findTodoById(id) ?: throw NotFoundException(...)
```

#### Lambda expressions

Lambda expressions are used throughout, for example when transforming data or sorting:

```kotlin
val todos = todoRepository
    .findByCreatedAtBefore(date)
    .sortedByDescending { it.createdAt }
```

Also used in mapping lists:

```kotlin
todoService.getAllTodos().map { it.toResponse() }
```

#### Named arguments

Kotlin allows for named arguments, which let you explicitly specify the name of each parameter when calling a function or constructor:

```kotlin
ApiResponse(success = false, data = null, error = message)

// vs
// ApiResponse(false, null, message)
```

This idiom improves readability by making it clear what each value represents, and it also allows you to pass arguments in any order. Named arguments are especially useful when dealing with functions or constructors that have many parameters, default values, or nullable types.
FE - in progress ([readme](https://github.com/venelinpetrov/todo-fullstack/blob/master/frontend/README.md))


## Frontend - React / TS / Redux toolkit (a.k.a RTK) / React Router Todo front-end app

This document explains in detail how the Todo app front end was structured. This app support several features

- CRUD operations on Todos
- Optimisitc updates
- Debouncing of requests
- Notifications to show success or error statuses.

## Setup

In this section we will describe the project setup and dependencies

### ESLint and Prettier

Before diving into development, it's important to set up ESLint and Prettier. This setup will provide long-term benefits by enforcing consistency and preventing common mistakes.

- ESLint helps catch potential issues early, such as missing dependencies in `useEffect` through rules like exhaustive-deps and much more.

- Prettier automatically formats your code whenever you save (e.g., using `Ctrl+S` in your IDE), making development smoother and more efficient.

For this to work you need to install the following *dev dependencies:*

```bash
npm i -D @eslint/js @types/eslint__js @typescript-eslint/eslint-plugin@typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh prettier typescript-eslint
```

For VS Code: make sure you have ESLint and Prettier plugins installed, as well as enabling these settings:

```json
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
},
"eslint.format.enable": true,
"editor.formatOnPaste": true
```

You also need a `.prettierrc` and a `eslint.config.js` files.


### Redux toolkit (RTK)

We’ll use Redux Toolkit (RTK) for data querying and caching. RTK is the modern, recommended approach to using Redux, offering a simplified and more efficient developer experience.

**Note**: For such a simple app, you don't really need RTK, but this is a great opportunity to demonstrate its capabilities and highlight real-world use cases.

Let's install the required dependencies

```bash
npm i @reduxjs/toolkit react-redux qs axios
npm i --save-dev @types/qs
```

The first two are RTK related.

[qs](https://www.npmjs.com/package/qs) is a querystring parsing and stringifying library. `@types/qs` provides TS bindings.

[axios](https://github.com/axios/axios) is a feature-rich HTTP client that is commonly used with RTK.

The setup requires 5 pieces

1. `utils/makeApi.ts` This is where we configure `qs`, `axios`, as well as the success and error response objects, which together define the fetching mechanism for this app

2. `utils/store.ts` Basic store setup. Here we include the slice reducers and middleware (if any)

3. `store/todos/api.ts` Is the api endpoints definitions

4. `store/notification/slice.ts` Is where we define the reducers for the notification state. This file exports the action creators and the notification reducer.

5. `store/notification/selectors.ts` This file exports one selector for the notification state.

## UI

TODO: Add directory tree

This section explains how the UI is built.

### Routing

For this app we use React Router 7. The setup is fairly simple

```jsx
<BrowserRouter>
	<Routes>
		<Route path="/" element={<HomePage />} />
		<Route path="/todos/:id" element={<TodoDetailsPage />} />
	</Routes>
</BrowserRouter>
```

### Components

Components live in the `src/components` directory and are exported from an `index.ts` for easy import afterwards.

### Pages

Pages live in the `src/pages` directory and are `default` exported so we can use them in the router. It's also a good practice to memoize them, for better performance in larger apps. In this case it doesn't matter.

### Notification Mechanism

Notifications are a bit unique in how they're handled. They're implemented via the `<Notification />` component, which resides at the top level of the app. However, unlike most components, notification state needs to be updated from anywhere in the app, regardless of component hierarchy.

To support this, we use createSlice to define a notification slice that exposes two actions: `showNotification` and `hideNotification`.

For convenience, we've created a `useNotification` hook to simplify dispatching these actions. This hook abstracts away the need to manually import `useDispatch` and call it directly. Instead, it provides two utility functions that handle the dispatching for you.

### Error Handling

Error handling is implemented in two ways: local and global.

1. Local Error Handling

Errors are caught using `try-catch` blocks. When an error occurs, the useNotification hook is used to dispatch a notification with the appropriate payload.

2. Global Error Handling


This follows the same approach in terms of UI feedback, but is handled via middleware, on a global level. See `errorHandlingMiddleware.ts`

```ts
export const errorHandlingMiddleware: Middleware =
	({ dispatch }) =>
	(next) =>
	(action) => {
		if (isRejectedWithValue(action)) {
			dispatch(
				notificationSlice.actions.showNotification({
					severity: NotificationSeverity.Error,
					title: 'An error occurred!',
					message:
						(action.payload as { message?: string }).message || '',
				})
			);
		}

		return next(action);
	};

```

and then, in `/utils/store.ts`

```ts
middleware: (getDefaultMiddleware) =>
	getDefaultMiddleware().concat(
		myApi.middleware,
		errorHandlingMiddleware // << Add the middleware
	),
```

### Optimistic updates.

For both creating and deleting items, we implement optimistic updates to improve perceived performance. This approach also simplifies state management by avoiding potential inconsistencies that can arise from manually syncing local and remote state.

This happens in the API layer (see `store/todos/api.ts`):

```ts
deleteTodo: build.mutation<TodoResponse, number>({
	query: (id) => ({
		url: `todos/${id}`,
		method: 'DELETE',
	}),
	async onQueryStarted(id, { dispatch, queryFulfilled }) {
		const patchResult = dispatch(
			todosApi.util.updateQueryData(
				'fetchAllTodos',
				undefined,
				(draft) => {
					return draft.filter((todo) => todo.id != id);
				}
			)
		);

		try {
			await queryFulfilled;
		} catch {
			patchResult.undo();
		}
	},
	invalidatesTags: (_red, err) =>
		err ? [] : [{ type: Tag.TODO, id: 'LIST' }],
}),
```
This technique enables direct manipulation of the cached state through optimistic updates. If the server request fails, the change is rolled back using `patchResult.undo()`, ensuring the UI remains consistent with the actual data.
### Types

Types can be defined at various levels, but our preferred approach is to define them as close as possible to where they are used. If a type needs to be elevated to a higher scope, we do so only when there’s a clear need. This helps us avoid unnecessarily polluting the global or shared type space.
