import type {
	CreateTodoRequest,
	PartialUpdateTodoRequest,
	TodoListItemResponse,
	TodoResponse,
	UpdateTodoRequest,
} from '../../types/todo';
import { myApi, Tag } from '../../utils/store/makeApi';

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
			invalidatesTags: (_res, err, { id }) =>
				err
					? []
					: [
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
			invalidatesTags: (_res, err, { id }) =>
				err
					? []
					: [
							{ type: Tag.TODO, id: 'LIST' },
							{ type: Tag.TODO, id },
						],
		}),
		createTodo: build.mutation<TodoResponse, { data: CreateTodoRequest }>({
			query: ({ data }) => ({
				url: 'todos',
				method: 'POST',
				data,
			}),
			async onQueryStarted({ data }, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					todosApi.util.updateQueryData(
						'fetchAllTodos',
						undefined,
						(draft) => {
							draft.unshift({
								id: Date.now(),
								completed: false,
								...data,
							});
						}
					)
				);

				try {
					await queryFulfilled;
				} catch {
					patchResult.undo();
				}
			},
			invalidatesTags: (_res, err) =>
				err ? [] : [{ type: Tag.TODO, id: 'LIST' }],
		}),
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
	}),
});

export const {
	useFetchAllTodosQuery,
	useFetchTodoQuery,
	usePutTodoMutation,
	usePatchTodoMutation,
	useCreateTodoMutation,
	useDeleteTodoMutation,
} = todosApi;
