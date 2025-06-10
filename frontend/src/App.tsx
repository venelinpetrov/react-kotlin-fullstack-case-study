import './App.css';
import { useFetchAllTodosQuery } from './store/todos/api';

function App() {
	const { data: todos, isLoading, error } = useFetchAllTodosQuery();

	return (
		<div>
			{isLoading ? (
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
