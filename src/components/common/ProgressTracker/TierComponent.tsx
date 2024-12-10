import CheckIcon from "~/components/icons/CheckIcon";
import { Tier } from "./types";

export const TierComponent: React.FC<{ tier: Tier }> = ({ tier }) => (
	<div className="h-[171px] p-4 bg-white rounded-lg border border-[#e1e6ef] flex flex-col w-full my-4">
		<div className="flex flex-col gap-3.5 h-full">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="w-[30px] h-[30px] bg-[#eff4ff] rounded-full" />
					<div className="text-[#08123b] text-sm font-bold">{tier.title}</div>
				</div>
				<div className="w-[38px] h-[38px] bg-[#eaeaea] rounded-full flex items-center justify-center">
					<div className="w-6 h-6 rotate-180" />
				</div>
			</div>

			<div className="text-[#414141] text-sm">{tier.text}</div>

			<div className="flex gap-2">
				{tier.milestones.map((milestone, index) => (
					<label key={index} className="flex items-center space-x-3 cursor-pointer">
						<div className="relative w-5 h-5">
							{milestone.completed ? (
								<CheckIcon className="absolute inset-0" />
							) : (
								<div className="w-5 h-5 rounded-md border border-[#1836B2] bg-[#F9F5FF]" />
							)}
						</div>
						<div className="text-[#414141] text-sm w-[136px]">{milestone.title}</div>
					</label>
				))}
			</div>
		</div>
	</div>
);
