import React from "react";
import { ProfitAndLossStatus } from "~/apis/handlers/trading-engine/enums";

export interface IProfitAndLossProps {
	price: number;
	value: number;
	type: ProfitAndLossStatus;
}

const ProfitAndLoss: React.FC<IProfitAndLossProps> = ({ price, value, type }) => {
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
			textColor = value >= 0 ? "text-[#08875D]" : "text-[#E02D3C]";
			break;
		}
		default: {
			textColor = "";
		}
	}

	return (
		<div className="space-y-1 text-right xl:text-center">
			<p
				className={`font-medium text-sm md:font-semibold md:text-base xl:font-medium xl:text-sm ${type === ProfitAndLossStatus.PnL ? textColor : "text-gray-500"}`}
			>
				{price}
			</p>
			<p
				className={`${textColor} font-normal text-xs md:font-medium md:text-base xl:font-normal xl:text-xs`}
			>
				{value}
				{type === ProfitAndLossStatus.PnL ? "%" : " USDT"}
			</p>
		</div>
	);
};

export default ProfitAndLoss;
