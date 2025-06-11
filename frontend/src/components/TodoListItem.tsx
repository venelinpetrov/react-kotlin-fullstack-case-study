import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router';
import { usePatchTodoMutation } from '../store/todos/api';

interface TodoListItemProps {
	id: number;
	title: string;
	completed: boolean;
}
const DELAY = 300; // ms

export const TodoListItem = ({ id, title, completed }: TodoListItemProps) => {
	const [patchTodo] = usePatchTodoMutation();
	const [value, setValue] = useState(completed);
	const sentRef = useRef(false);

	// Optimistic update + debouncing
	const handleChange = useCallback(
		async (value: boolean) => {
			setValue(value);

			if (sentRef.current) {
				return;
			}
			sentRef.current = true;
			try {
				await patchTodo({ id, data: { completed: value } });
			} catch {
				setValue(completed);
			} finally {
				setTimeout(() => {
					sentRef.current = false;
				}, DELAY);
			}
		},
		[id, patchTodo, completed]
	);

	return (
		<div>
			<Link to={`/todos/${id}`}>{title}</Link>
			<input
				type="checkbox"
				checked={value}
				onChange={(e) => handleChange(e.target.checked)}
			/>
		</div>
	);
};
