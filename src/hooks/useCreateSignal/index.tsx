import { AssetsService } from "~/apis/handlers/assets";
import { useCreate } from "../useCreate";

export const useCreateSignal = () => {
	const assetsService = new AssetsService();
	const {
		mutate: createSignal,
		isError,
		isPending,
		error,
		isSuccess,
		data,
	} = useCreate({
		mutationFn: assetsService.createSignal.bind(assetsService),
	});

	return {
		createSignal,
		isError,
		isPending,
		error,
		isSuccess,
		data,
	};
};
