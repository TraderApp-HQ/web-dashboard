import type { MutationFunction, UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface MutationOptions<T, Variables = void> {
	mutationFn: MutationFunction<T, Variables>;
	onSuccess?: (data: T) => void;
	onError?: (error: Error) => void;
	onSettled?: (
		data: T | undefined,
		error: Error | null,
		variables: Variables,
		context: unknown,
	) => void;
}

type SafeMutationResult<T, Variables = void> = Omit<
	UseMutationResult<T, Error, Variables, unknown>,
	"error"
> & {
	error: Error | null;
};

export const useCreate = <T, Variables = void>({
	mutationFn,
	onSuccess,
	onError,
	onSettled,
}: MutationOptions<T, Variables>): SafeMutationResult<T, Variables> => {
	const mutation = useMutation<T, Error, Variables>({
		mutationFn,
		onSuccess,
		onError,
		onSettled,
	});

	return {
		...mutation,
		error:
			mutation.error instanceof Error
				? mutation.error
				: new Error("An unknown error occurred"),
	};
};
