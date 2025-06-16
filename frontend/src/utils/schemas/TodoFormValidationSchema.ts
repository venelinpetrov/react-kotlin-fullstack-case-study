import * as yup from 'yup';

export const todoFormValidationSchema = yup.object({
	title: yup
		.string()
		.required('Title is required')
		.min(3, 'Title should be at least 3 characters long')
		.max(80, 'Title should be 80 characters at most'),
});
