import type { myApi } from '../utils/makeApi';
import type {
	notificationReducer,
	notificationSlice,
} from './notification/slice';

export type RootState = {
	[notificationSlice.reducerPath]: ReturnType<typeof notificationReducer>;
	[myApi.reducerPath]: ReturnType<typeof myApi.reducer>;
};
