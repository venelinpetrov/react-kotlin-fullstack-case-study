import '../App.css';
import { useFetchAllTodosQuery } from '../store/todos/api';
import { TodoListItem } from '../components';
import { memo } from 'react';

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
