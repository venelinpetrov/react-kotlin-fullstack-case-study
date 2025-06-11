export interface ApiResponse<T> {
	success: boolean;
	data: T;
	error: string | null;
}

export interface TodoResponse {
	id: number;
	title: string;
	description: string;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface TodoListItemResponse {
	id: number;
	title: string;
	completed: boolean;
}

export interface PartialUpdateTodoRequest {
	title?: string;
	description?: string;
	completed?: boolean;
}
