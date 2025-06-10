import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import { stringify } from 'qs';

const instance = axios.create({
	paramsSerializer: (params) => stringify(params, { arrayFormat: 'comma' }),
});

export interface RequestError {
	status: number;
	error: string;
}

const axiosBaseQuery = ({
	baseUrl,
}: {
	baseUrl: string;
}): BaseQueryFn<
	{
		url: string;
		method: AxiosRequestConfig['method'];
		data?: AxiosRequestConfig['data'];
		params?: AxiosRequestConfig['params'];
		config?: AxiosRequestConfig;
	},
	unknown,
	RequestError | undefined
> => {
	return async ({ url, method, data, params = {}, config = {} }) => {
		try {
			const result = await instance({
				url: baseUrl + url,
				method,
				data,
				params,
				...config,
			});
			return {
				data: result.data.data,
				error: result.data.data.error,
			};
		} catch (axiosError) {
			const err = axiosError as AxiosError<{ error: string }>;
			return {
				data: undefined,
				error: {
					status: err.response?.status,
					error: err.response?.data.error,
				},
			};
		}
	};
};

export enum Tag {
	TODO = 'TODO',
}

export const myApi = createApi({
	reducerPath: 'api', // TODO maybe add more specific name?
	baseQuery: axiosBaseQuery({
		baseUrl: 'http://localhost:8080/api/', // TODO env var
	}),
	endpoints: () => ({}),
	tagTypes: Object.values(Tag),
});
