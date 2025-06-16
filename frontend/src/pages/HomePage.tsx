import '../App.css';
import { memo } from 'react';
import { AddTodoForm, TodoListItem } from '../components';
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
				<section>
					<AddTodoForm />
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
				</section>
			)}
		</div>
	);
};

export default memo(HomePage);
