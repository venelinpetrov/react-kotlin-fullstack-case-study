import { useParams } from 'react-router';
import { useFetchTodoQuery } from '../store/todos/api';
import { memo } from 'react';

const TodoDetailsPage = () => {
	const { id } = useParams();
	const parsedId = parseInt(id!);
	const {
		data: todo,
		isLoading,
		error,
	} = useFetchTodoQuery(parsedId, {
		skip: !parsedId,
	});
	return (
		<div>
			{error ? (
				<p>{error.message}</p>
			) : isLoading ? (
				<p>Loading...</p>
			) : (
				<>
					<h1>{todo?.title}</h1>
					<p>{todo?.description || 'No description'}</p>
					<p>Completed: {todo?.completed ? 'Yes' : 'No'}</p>
				</>
			)}
		</div>
	);
};

export default memo(TodoDetailsPage);
