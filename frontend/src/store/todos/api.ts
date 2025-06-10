import type { TodoListItemResponse, TodoResponse } from '../../types/todo';
import { myApi, Tag } from '../../utils/makeApi';

export const todosApi = myApi.injectEndpoints({
	endpoints: (build) => ({
		fetchAllTodos: build.query<TodoListItemResponse[], void>({
			query: () => ({
				url: 'todos',
				method: 'GET',
			}),
			providesTags: [Tag.TODO],
		}),
		fetchTodo: build.query<TodoResponse, number>({
			query: (id) => ({
				url: `todos/${id}`,
				method: 'GET',
			}),
			providesTags: [Tag.TODO],
		}),
	}),
});

export const { useFetchAllTodosQuery, useFetchTodoQuery } = todosApi;
