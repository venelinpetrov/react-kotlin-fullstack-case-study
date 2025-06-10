import './App.css';
import { useFetchAllTodosQuery } from './store/todos/api';

function App() {
	const { data: todos, isLoading, error } = useFetchAllTodosQuery();
	// useEffect(() => {
	// 	async function fetchTodos() {
	// 		try {
	// 			const res = await window.fetch(
	// 				'http://localhost:8080/api/todos',
	// 				{
	// 					method: 'GET',
	// 				}
	// 			);
	// 			const todos = (await res.json()) as ApiResponse<TodoResponse[]>;
	// 			if (todos.success) {
	// 				setTodos(todos.data);
	// 			}
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	}

	// 	fetchTodos();
	// }, []);
	console.log({ todos, isLoading, error });
	return (
		<div>
			{/* {todos === null ? (
				<p>Loading...</p>
			) : (
				<ul>
					{todos.map(({ title }) => (
						<li key={title}>{title}</li>
					))}
				</ul>
			)} */}
		</div>
	);
}

export default App;
