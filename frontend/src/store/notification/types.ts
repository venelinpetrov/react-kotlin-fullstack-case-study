export enum NotificationSeverity {
	Success = 'success',
	Error = 'error',
}

export interface NotificationStatusData {
	open: boolean;
	title: string | null;
	message: string | null;
	severity: NotificationSeverity | null | undefined;
}

export interface NotificationState {
	notificationStatus: NotificationStatusData;
}
