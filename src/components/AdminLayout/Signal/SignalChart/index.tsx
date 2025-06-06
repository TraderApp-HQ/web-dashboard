import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { AssetsService } from "~/apis/handlers/assets";
import { AssetsQueryId } from "~/apis/handlers/assets/constants";
import { useFetch } from "~/hooks/useFetch";

const SignalChart = () => {
	const router = useRouter();
	const id = router.query.id as string;

	const signalsService = new AssetsService();
	const fetchSignal = useCallback(() => signalsService?.getSignal(`${id}`), [id, signalsService]);

	const {
		data: signal,
		isLoading,
		isSuccess,
	} = useFetch({
		queryKey: [AssetsQueryId.signals],
		queryFn: fetchSignal,
	});

	return (
		<div className="sm:w-[100%] gap-y-8">
			<div className="flex h-[600px] max-h-[650px] justify-center rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
				{isLoading && <div>loading...</div>}
				{isSuccess && signal && (
					<Image
						src={signal?.chartUrl}
						style={{
							width: "100%",
							height: "580px",
						}}
						width={100}
						height={100}
						sizes="100vw"
						alt="signal chart"
					/>
				)}
			</div>
		</div>
	);
};

export default SignalChart;
