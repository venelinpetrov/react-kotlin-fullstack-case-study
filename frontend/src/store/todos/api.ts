import type {
	PartialUpdateTodoRequest,
	TodoListItemResponse,
	TodoResponse,
	UpdateTodoRequest,
} from '../../types/todo';
import { myApi, Tag } from '../../utils/makeApi';

export const todosApi = myApi.injectEndpoints({
	endpoints: (build) => ({
		fetchAllTodos: build.query<TodoListItemResponse[], void>({
			query: () => ({
				url: 'todos',
				method: 'GET',
			}),
			providesTags: [{ type: Tag.TODO, id: 'LIST' }],
		}),
		fetchTodo: build.query<TodoResponse, number>({
			query: (id) => ({
				url: `todos/${id}`,
				method: 'GET',
			}),
			providesTags: (_res, _err, id) => [{ type: Tag.TODO, id }],
		}),
		patchTodo: build.mutation<
			TodoResponse,
			{ id: number; data: PartialUpdateTodoRequest }
		>({
			query: ({ id, data }) => ({
				url: `todos/${id}`,
				method: 'PATCH',
				data,
			}),
			invalidatesTags: (_res, _err, { id }) => [
				{ type: Tag.TODO, id: 'LIST' },
				{ type: Tag.TODO, id },
			],
		}),
		putTodo: build.mutation<
			TodoResponse,
			{ id: number; data: UpdateTodoRequest }
		>({
			query: ({ id, data }) => ({
				url: `todos/${id}`,
				method: 'PUT',
				data,
			}),
			invalidatesTags: (_res, _err, { id }) => [
				{ type: Tag.TODO, id: 'LIST' },
				{ type: Tag.TODO, id },
			],
		}),
	}),
});

export const {
	useFetchAllTodosQuery,
	useFetchTodoQuery,
	usePutTodoMutation,
	usePatchTodoMutation,
} = todosApi;
