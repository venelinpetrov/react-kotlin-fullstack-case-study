import './TodoListItem.css';
import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useNotification } from './Notification/Notification';
import { NotificationSeverity } from '../store/notification/types';
import {
	useDeleteTodoMutation,
	usePatchTodoMutation,
} from '../store/todos/api';

interface TodoListItemProps {
	id: number;
	title: string;
	completed: boolean;
}
const DELAY = 300; // ms

export const TodoListItem = ({ id, title, completed }: TodoListItemProps) => {
	const [patchTodo] = usePatchTodoMutation();
	const [deleteTodo] = useDeleteTodoMutation();
	const { showNotification } = useNotification();
	const [value, setValue] = useState(completed);
	const debounceTimerRef = useRef<number | null>(null);

	const handleDelete = useCallback(async () => {
		await deleteTodo(id);
		showNotification({ message: 'Todo successfully deleted' });
	}, [deleteTodo, id, showNotification]);

	// Optimistic update + debouncing
	const handleChange = useCallback(
		async (value: boolean) => {
			setValue(value);

			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}

			debounceTimerRef.current = setTimeout(async () => {
				try {
					if (value == completed) {
						return;
					}
					await patchTodo({ id, data: { completed: value } });
					showNotification({
						message: 'Successfully updated todo',
						severity: NotificationSeverity.Success,
					});
				} catch {
					setValue(completed);
				}
			}, DELAY);
		},
		[patchTodo, id, showNotification, completed]
	);

	return (
		<div className="todo-list-item">
			<div>
				<Link to={`/todos/${id}`}>{title}</Link>
				<input
					type="checkbox"
					checked={value}
					onChange={(e) => handleChange(e.target.checked)}
				/>
			</div>
			<button onClick={handleDelete}>-</button>
		</div>
	);
};
