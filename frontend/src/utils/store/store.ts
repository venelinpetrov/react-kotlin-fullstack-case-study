import { configureStore } from '@reduxjs/toolkit';
import { errorHandlingMiddleware } from './errorHandlingMiddleware';
import { myApi } from './makeApi';
import { notificationSlice } from '../../store/notification/slice';

export const store = configureStore({
	reducer: {
		[myApi.reducerPath]: myApi.reducer,
		[notificationSlice.reducerPath]: notificationSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			myApi.middleware,
			errorHandlingMiddleware
		),
});
