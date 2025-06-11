import type { RootState } from '../types';
import type { NotificationStatusData } from './types';

export const selectNotificationStatus = (
	state: RootState
): NotificationStatusData => state.notification.notificationStatus;
