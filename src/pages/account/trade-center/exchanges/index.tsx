import { NestedTradeCenterLayout } from "..";
import myExchangeData from "~/data/wallet/data.json";
import EmptyExchange from "~/components/AccountLayout/TradeCenter/EmptyExchange";
import Button from "~/components/AccountLayout/Button";
import MyExchangeCard from "~/components/AccountLayout/TradeCenter/MyExchangeCard";
import { IExchange } from "~/apis/handlers/assets/interfaces";
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
					<div className="flex justify-between flex-col md:flex-row">
						<h1 className="text-slate-900 text-3xl font-semibold mb-4">My Exchanges</h1>
						<Button
							onClick={() => {
								router.push("exchanges/connect");
							}}
							className="!block"
							innerClassName="px-4 md:px-4 text-xl md:text-sm"
						>
							Connect new Exchange
						</Button>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
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
