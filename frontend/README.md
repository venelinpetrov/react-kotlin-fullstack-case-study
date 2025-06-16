# React / TS / Redux toolkit (a.k.a RTK) / React Router Todo front-end app

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