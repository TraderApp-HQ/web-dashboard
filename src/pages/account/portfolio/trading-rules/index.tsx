/* eslint-disable jsx-a11y/label-has-associated-control */
import InputField from "~/components/common/InputField";
import { NestedPortfolioLayout } from "..";

const TradingRules = () => {
	return (
		<div>
			<div className="space-y-4 md:w-9/11">
				<div className="rounded-3xl p-5 bg-white">
					<h2 className="text-[#08123B] font-bold py-3">Diversification</h2>
					<div className="flex flex-col lg:flex-row lg:justify-between lg:space-x-9 mt-6">
						<div className="w-full">
							<label className="text-[#08123B] text-sm font-semibold">
								Minimum number of trade
							</label>
							<div className="trading-rules-box">
								<InputField type="text" className="textbox" />
							</div>
						</div>
						<div className="w-full">
							<label className="text-[#08123B] text-sm font-semibold">
								Minimum capital amount
							</label>
							<div className="trading-rules-box">
								<InputField type="text" className="textbox" />
							</div>
						</div>
						<div className="w-full">
							<label className="text-[#08123B] text-sm font-semibold">
								Maximum capital percentage
							</label>
							<div className="trading-rules-box">
								<InputField type="text" className="textbox" />
							</div>
						</div>
					</div>
				</div>
				<div className="rounded-3xl p-5 lg:w-3/5 bg-white">
					<h2 className="text-[#08123B] font-bold py-3">Risk</h2>
					<div className="flex flex-col lg:flex-row lg:justify-between lg:space-x-9 mt-6">
						<div className="w-full">
							<label className="text-[#08123B] text-sm font-semibold">
								Maximum stop loss amount
							</label>
							<div className="trading-rules-box">
								<InputField type="text" className="textbox" />
							</div>
						</div>
						<div className="w-full">
							<label className="text-[#08123B] text-sm font-semibold">
								Maximum stop loss percentage
							</label>
							<div className="trading-rules-box">
								<InputField type="text" className="textbox" />
							</div>
						</div>
					</div>
				</div>

				<div className="">
					<h2 className="text-[#08123B] font-bold py-3">Exit Strategy</h2>
					<div className="mt-1 p-4 rounded-3xl bg-white lg:w-2/5">
						<div className="flex items-center mb-4">
							<InputField
								type="radio"
								className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
							/>
							<label
								htmlFor="target-profit"
								className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
							>
								When target profit is reached
							</label>
						</div>
						<div className="flex items-center mb-4">
							<InputField
								type="radio"
								className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
							/>
							<label
								htmlFor="signal-ends"
								className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
							>
								When signal ends
							</label>
						</div>
						<div className="flex items-center mb-4">
							<InputField
								type="radio"
								className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
							/>
							<label
								htmlFor="auto"
								className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
							>
								Auto
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

TradingRules.getLayout = (page: React.ReactElement) => (
	<NestedPortfolioLayout>{page}</NestedPortfolioLayout>
);
export default TradingRules;
