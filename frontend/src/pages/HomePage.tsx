import '../App.css';
import { memo } from 'react';
import { TodoListItem } from '../components';
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
					{todos?.map(({ id, title, completed }) => (
						<li key={id}>
							<TodoListItem
								id={id}
								title={title}
								completed={completed}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default memo(HomePage);
