// import { useQuery, QueryFunction, QueryKey, useQueryClient } from "@tanstack/react-query";

// interface QueryOptions<T> {
//   queryKey: QueryKey;
//   queryFn: QueryFunction<T>;
//   dependencies?: any[];
// }

// export const useFetch = <T>({ queryKey, queryFn }: QueryOptions<T>) => {
//   return useQuery<T>({ queryKey, queryFn });
// };

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
}: QueryOptions<T>): UseQueryResult<T, Error> => {
	const combinedQueryKey = [...queryKey, ...dependencies];

	return useQuery<T, Error>({
		queryKey: combinedQueryKey,
		queryFn,
		onSuccess,
		onError,
	} as UseQueryOptions<T, Error>);
};
