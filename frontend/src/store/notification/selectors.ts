import type { NotificationStatusData } from './types';
import type { RootState } from '../types';

export const selectNotificationStatus = (
	state: RootState
): NotificationStatusData => state.notification.notificationStatus;
