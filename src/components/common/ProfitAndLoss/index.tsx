import { ProfitAndLossStatus } from "~/apis/handlers/trading-engine/enums";

export interface IProfitAndLoss {
	price: number;
	value: number;
	type: ProfitAndLossStatus;
}

const ProfitAndLoss = ({ price, value, type }: IProfitAndLoss) => {
	let textColor: string;

	switch (type) {
		case ProfitAndLossStatus.PROFIT: {
			textColor = "text-[#08875D]";
			break;
		}
		case ProfitAndLossStatus.LOSS: {
			textColor = "text-[#E02D3C]";
			break;
		}
		case ProfitAndLossStatus.PnL: {
			textColor = price >= 0 ? "text-[#08875D]" : "text-[#E02D3C]";
			break;
		}
		default: {
			textColor = "";
		}
	}

	return (
		<div className="space-y-1 text-right md:text-center">
			<p className="font-medium text-gray-500 text-sm">{price}</p>
			<p className={`${textColor} font-normal text-xs`}>
				{value}
				{type === ProfitAndLossStatus.PnL ? "%" : " USDT"}
			</p>
		</div>
	);
};

export default ProfitAndLoss;
