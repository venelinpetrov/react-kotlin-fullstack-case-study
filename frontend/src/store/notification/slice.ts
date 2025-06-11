import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { NotificationSeverity, NotificationState } from './types';

const initialState: NotificationState = {
	notificationStatus: {
		open: false,
		title: null,
		message: null,
		severity: null,
	},
};

export const notificationSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		showNotification(
			state,
			{
				payload: { title, message, severity },
			}: PayloadAction<{
				message: string;
				title?: string;
				severity?: NotificationSeverity;
			}>
		) {
			state.notificationStatus = {
				open: true,
				title: title || null,
				message,
				severity,
			};
		},
		hideNotification(state) {
			state.notificationStatus.open = false;
		},
	},
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
