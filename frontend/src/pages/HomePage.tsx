import { Link } from 'react-router';
import '../App.css';
import { useFetchAllTodosQuery } from '../store/todos/api';

const HomePage = () => {
	const { data: todos, isLoading, error } = useFetchAllTodosQuery();

	return (
		<div>
			{error ? (
				<p>{error.message}</p>
			) : isLoading ? (
				<p>Loading...</p>
			) : (
				<ul>
					{todos?.map(({ id, title }) => (
						<li key={id}>
							<Link to={`/todos/${id}`}>{title}</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default HomePage;
