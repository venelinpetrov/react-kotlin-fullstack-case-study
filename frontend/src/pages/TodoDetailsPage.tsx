import { useFormik } from 'formik';
import { memo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as yup from 'yup';
import { useNotification } from '../components';
import { NotificationSeverity } from '../store/notification/types';
import { useFetchTodoQuery, usePutTodoMutation } from '../store/todos/api';
import type { UpdateTodoRequest } from '../types/todo';

const validationSchema = yup.object({
	title: yup
		.string()
		.required('Title is required')
		.min(3, 'Title should be at least 3 characters long')
		.max(80, 'Title should be 80 characters at most'),
});
const TodoDetailsPage = () => {
	const { id } = useParams();
	const parsedId = parseInt(id!);
	const navigate = useNavigate();
	const { showNotification } = useNotification();

	const {
		data: todo,
		isLoading,
		error,
	} = useFetchTodoQuery(parsedId, {
		skip: !parsedId,
	});

	const [putTodo] = usePutTodoMutation();

	const { values, errors, isValid, handleChange, submitForm } =
		useFormik<UpdateTodoRequest>({
			initialValues: todo || {
				title: '',
				description: '',
				completed: false,
			},
			enableReinitialize: true,
			validationSchema,
			onSubmit: async (values) => {
				try {
					await putTodo({ id: todo!.id, data: values }).unwrap();
					showNotification({ message: 'Updated successfully' });
					navigate('/');
				} catch (e) {
					showNotification({
						title: 'An error occurred',
						message:
							'message' in Object(e)
								? ((e as { message: string }).message as string)
								: 'Something went wrong',
						severity: NotificationSeverity.Error,
					});
				}
			},
		});

	const [edit, setEdit] = useState(false);

	return (
		<div>
			{error ? (
				<p>{error.message}</p>
			) : isLoading ? (
				<p>Loading...</p>
			) : edit ? (
				<div>
					<div>
						<label htmlFor="title">Title:</label>
						<input
							id="title"
							name="title"
							value={values.title}
							onChange={handleChange}
						/>
						{errors.title && (
							<p style={{ color: 'red' }}>{errors.title}</p>
						)}
					</div>
					<div>
						<label htmlFor="description">Description:</label>
						<textarea
							id="description"
							name="description"
							value={values.description}
							onChange={handleChange}
						></textarea>
					</div>
					<div>
						<label htmlFor="completed">Completed:</label>
						<input
							type="checkbox"
							id="completed"
							name="completed"
							checked={values.completed}
							onChange={handleChange}
						/>
					</div>
					<button onClick={() => setEdit(false)}>Cancel</button>
					<button disabled={!isValid} onClick={submitForm}>
						Submit
					</button>
				</div>
			) : (
				<>
					<h1>{todo?.title}</h1>
					<p>{todo?.description || 'No description'}</p>
					<p>Completed: {todo?.completed ? 'Yes' : 'No'}</p>
					<button onClick={() => setEdit(true)}>Edit</button>
				</>
			)}
		</div>
	);
};

export default memo(TodoDetailsPage);
