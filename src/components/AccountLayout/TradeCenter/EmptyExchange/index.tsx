import TradeCenterIcon from "~/components/icons/TradeCenterIcon";
import Button from "../../../AccountLayout/Button";
import { useRouter } from "next/router";

const EmptyExchange = () => {
	const router = useRouter();
	return (
		<div className="flex mt-24 gap-y-6 flex-col justify-center text-center">
			<div className="w-20 h-16 bg-indigo-50 rounded-xl self-center flex items-center justify-center">
				<TradeCenterIcon color="#1836B2" size={{ width: "50", height: "50" }} />
			</div>
			<div>
				<h1 className="text-blue-900 text-2xl font-bold leading-loose">Not connected</h1>
				<h3 className="text-neutral-600 text-base font-normal leading-normal">
					You don’t have any connected account
				</h3>
			</div>
			<Button
				onClick={() => {
					router.push("/account/trade-center/trading-accounts/connect");
				}}
				innerClassName="w-96"
			>
				Connect new trading account
			</Button>
		</div>
	);
};

export default EmptyExchange;
