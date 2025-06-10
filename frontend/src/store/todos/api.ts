import type { TodoResponse } from '../../types/todo';
import { myApi, Tag } from '../../utils/makeApi';

export const todosApi = myApi.injectEndpoints({
	endpoints: (build) => ({
		fetchAllTodos: build.query<TodoResponse[], void>({
			query: () => ({
				url: 'todos',
				method: 'GET',
			}),
			providesTags: [Tag.TODO],
		}),
	}),
});

export const { useFetchAllTodosQuery } = todosApi;
