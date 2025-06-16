import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';
import { notificationSlice } from '../../store/notification/slice';
import { NotificationSeverity } from '../../store/notification/types';

export const errorHandlingMiddleware: Middleware =
	({ dispatch }) =>
	(next) =>
	(action) => {
		if (isRejectedWithValue(action)) {
			dispatch(
				notificationSlice.actions.showNotification({
					severity: NotificationSeverity.Error,
					title: 'An error occurred!',
					message:
						(action.payload as { message?: string }).message || '',
				})
			);
		}

		return next(action);
	};
