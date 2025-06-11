import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router';
import { usePatchTodoMutation } from '../store/todos/api';
import { useNotification } from './Notification/Notification';
import { NotificationSeverity } from '../store/notification/types';

interface TodoListItemProps {
	id: number;
	title: string;
	completed: boolean;
}
const DELAY = 300; // ms

export const TodoListItem = ({ id, title, completed }: TodoListItemProps) => {
	const [patchTodo] = usePatchTodoMutation();
	const [value, setValue] = useState(completed);
	const { showNotification } = useNotification();
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
				showNotification({
					message: 'Successfully updated todo',
					severity: NotificationSeverity.Success,
				});
			} catch {
				setValue(completed);
			} finally {
				setTimeout(() => {
					sentRef.current = false;
				}, DELAY);
			}
		},
		[patchTodo, id, showNotification, completed]
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
