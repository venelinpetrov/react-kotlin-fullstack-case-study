import { useEffect, useState } from 'react';
import './App.css';

interface ApiResponse<T> {
	success: boolean;
	data: T;
	error: string | null;
}

interface TodoResponse {
	id: number;
	title: string;
	description: string;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
}

function App() {
	const [todos, setTodos] = useState<TodoResponse[] | null>(null);

	useEffect(() => {
		async function fetchTodos() {
			try {
				const res = await window.fetch(
					'http://localhost:8080/api/todos',
					{
						method: 'GET',
					}
				);
				const todos = (await res.json()) as ApiResponse<TodoResponse[]>;
				if (todos.success) {
					setTodos(todos.data);
				}
			} catch (error) {
				console.error(error);
			}
		}

		fetchTodos();
	}, []);

	return (
		<div>
			{todos === null ? (
				<p>Loading...</p>
			) : (
				<ul>
					{todos.map(({ title }) => (
						<li key={title}>{title}</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default App;
