/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
	QueryFunction,
	QueryKey,
	UseQueryOptions,
	UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

interface QueryOptions<T> {
	queryKey: QueryKey;
	queryFn: QueryFunction<T>;
	dependencies?: any[];
	onSuccess?: (data: T) => void;
	onError?: (error: unknown) => void;
}

export const useFetch = <T>({
	queryKey,
	queryFn,
	dependencies = [],
	onSuccess,
	onError,
	enabled = true,
}: QueryOptions<T> & { enabled?: boolean }): UseQueryResult<T, Error> => {
	const combinedQueryKey = [...queryKey, ...dependencies];
	return useQuery<T, Error>({
		queryKey: combinedQueryKey,
		queryFn,
		onSuccess,
		onError,
		refetchOnWindowFocus: false,
		enabled,
	} as UseQueryOptions<T, Error>);
};
