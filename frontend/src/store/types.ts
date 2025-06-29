import type {
	notificationReducer,
	notificationSlice,
} from './notification/slice';
import type { myApi } from '../utils/store/makeApi';

export type RootState = {
	[notificationSlice.reducerPath]: ReturnType<typeof notificationReducer>;
	[myApi.reducerPath]: ReturnType<typeof myApi.reducer>;
};
