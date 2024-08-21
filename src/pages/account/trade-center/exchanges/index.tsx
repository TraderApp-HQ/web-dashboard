import { IExchange } from "~/apis/handlers/signals/interfaces";
import { NestedTradeCenterLayout } from "..";
import myExchangeData from "~/data/wallet/data.json";
import EmptyExchange from "~/components/AccountLayout/TradeCenter/EmptyExchange";
import Button from "~/components/AccountLayout/Button";
import MyExchangeCard from "~/components/AccountLayout/TradeCenter/MyExchangeCard";
import { useRouter } from "next/router";

export interface IExchangeConnection extends IExchange {
	isConnected: boolean;
}

const TradeCenterExchanges = () => {
	const router = useRouter();
	const exchanges: IExchangeConnection[] = myExchangeData.exchanges;

	return (
		<div className="flex flex-col gap-y-8">
			{exchanges && exchanges.length > 0 ? (
				<>
					<div className="flex justify-between">
						<h1 className="text-slate-900 text-3xl font-semibold">My Exchanges</h1>
						<Button
							onClick={() => {
								router.push("exchanges/connect");
							}}
						>
							Connect new Exchange
						</Button>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8">
						{exchanges.map((exchange) => (
							<MyExchangeCard key={exchange.id} {...exchange} />
						))}
					</div>
				</>
			) : (
				<EmptyExchange />
			)}
		</div>
	);
};

TradeCenterExchanges.getLayout = (page: React.ReactElement) => (
	<NestedTradeCenterLayout>{page}</NestedTradeCenterLayout>
);
export default TradeCenterExchanges;
