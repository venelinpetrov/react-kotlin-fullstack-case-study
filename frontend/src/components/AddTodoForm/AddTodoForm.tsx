import { useFormik } from 'formik';
import { useState } from 'react';
import './AddTodoForm.css';
import { useCreateTodoMutation } from '../../store/todos/api';
import type { CreateTodoRequest } from '../../types/todo';
import { todoFormValidationSchema } from '../../utils/schemas/TodoFormValidationSchema';

export const AddTodoForm = () => {
	const [createTodo] = useCreateTodoMutation();
	const [isFormShown, setIsFormShown] = useState(false);
	const {
		values,
		errors,
		isValid,
		dirty,
		resetForm,
		handleChange,
		handleSubmit,
	} = useFormik<CreateTodoRequest>({
		initialValues: {
			title: '',
			description: '',
		},
		enableReinitialize: true,
		validationSchema: todoFormValidationSchema,
		onSubmit: (data) => {
			setIsFormShown(false);
			resetForm();
			createTodo({ data });
		},
	});

	return (
		<form onSubmit={(e) => e.preventDefault()}>
			<button onClick={() => setIsFormShown(true)}>Add new +</button>
			{isFormShown && (
				<div className="add-todo-form">
					<input
						name="title"
						type="text"
						value={values.title}
						onChange={handleChange}
					/>
					{errors.title && (
						<p style={{ color: 'red' }}>{errors.title}</p>
					)}
					<input
						name="description"
						type="text"
						value={values.description}
						onChange={handleChange}
					/>
					<button
						disabled={!isValid || !dirty}
						onClick={() => handleSubmit()}
					>
						Save
					</button>
					<button onClick={() => setIsFormShown(false)}>
						Cancel
					</button>
				</div>
			)}
		</form>
	);
};
