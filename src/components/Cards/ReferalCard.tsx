import React from "react";
import Card from "~/components/AccountLayout/Card";
import { IconProps } from "~/lib/types";

interface ICurrentRankCardProps {
	title: string;
	subtext: string;
	Icon: React.ComponentType<IconProps>;
}

const ReferalCard: React.FC<ICurrentRankCardProps> = ({ title, subtext, Icon }) => {
	return (
		<Card className="w-12/12 md:w-[40%] lg:w-[35%] xl:w-[30%] 2xl:w-[25%] px-3 py-7">
			<div className="flex-col justify-center items-start space-y-6 ml-0 sm:ml-3">
				<div className="flex justify-between items-center gap-14 md:gap-16">
					<div>
						<h3 className="text-neutral-700 text-sm font-semibold leading-tight mb-2">
							{title}
						</h3>
						<span className="text-slate-900 text-base font-semibold leading-none">
							{subtext}
						</span>
					</div>
					<span className="rounded-full bg-[#ecf0fe] p-2">
						<Icon />
					</span>
				</div>
			</div>
		</Card>
	);
};

export default ReferalCard;
