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
	refetch?: boolean;
	refetchTime?: number;
}

export const useFetch = <T>({
	queryKey,
	queryFn,
	dependencies = [],
	onSuccess,
	onError,
	enabled = true,
	refetch = false,
	refetchTime = 0,
}: QueryOptions<T> & { enabled?: boolean }): UseQueryResult<T, Error> => {
	const combinedQueryKey = [...queryKey, ...dependencies];

	// Ensure valid refetchTime if refetch is enabled
	const interval = refetch && refetchTime > 0 ? refetchTime : false;

	return useQuery<T, Error>({
		queryKey: combinedQueryKey,
		queryFn,
		onSuccess,
		onError,
		refetchOnWindowFocus: false,
		enabled,
		refetchInterval: interval, // This line helps to refetch query at a given interval (refetchTime in milliseconds)
	} as UseQueryOptions<T, Error>);
};
