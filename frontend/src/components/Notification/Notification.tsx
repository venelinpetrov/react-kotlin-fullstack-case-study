import { useDispatch, useSelector } from 'react-redux';
import './Notification.css';
import { selectNotificationStatus } from '../../store/notification/selectors';
import { useEffect, useMemo } from 'react';
import { NotificationSeverity } from '../../store/notification/types';
import {
	hideNotification,
	showNotification,
} from '../../store/notification/slice';

const NOTIFICATION_CLOSE_DELAY = 2000;

export const Notification = () => {
	const { open, message, severity } = useSelector(selectNotificationStatus);

	const dispatch = useDispatch();

	const severityClass = useMemo(() => {
		if (!severity) {
			return null;
		}
		return {
			[NotificationSeverity.Error]: 'error',
			[NotificationSeverity.Success]: 'success',
		}[severity];
	}, [severity]);

	const openClass = open ? 'open' : null;

	const className = useMemo(() => {
		return ['notification', openClass, severityClass]
			.filter(Boolean)
			.join(' ');
	}, [openClass, severityClass]);

	useEffect(() => {
		let id = undefined;
		if (open) {
			id = setTimeout(
				() => dispatch(hideNotification()),
				NOTIFICATION_CLOSE_DELAY
			);
		}
		return () => clearTimeout(id);
	}, [dispatch, open]);

	return <div className={className}>{message}</div>;
};

export const useNotification = () => {
	const dispatch = useDispatch();

	return {
		showNotification: (payload: {
			message: string;
			title?: string;
			severity?: NotificationSeverity;
		}) => dispatch(showNotification(payload)),

		hideNotification: () => dispatch(hideNotification()),
	};
};
