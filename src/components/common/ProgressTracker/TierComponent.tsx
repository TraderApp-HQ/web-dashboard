import CheckIcon from "~/components/icons/CheckIcon";
import CheckMarkIcon from "~/components/icons/CheckMarkIcon";
import { Tier } from "./types";
import DropdownIcon from "~/components/icons/DropdownIcon";
import { useMemo, useState } from "react";
import { isTierCompleted } from "~/helpers";

export const TierComponent: React.FC<{ tier: Tier }> = ({ tier }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const isCompleted = useMemo(() => isTierCompleted(tier), [tier]);
	return (
		<div className="h-full p-4 bg-white rounded-lg border border-[#e1e6ef] flex flex-col w-full my-4">
			<div className="flex flex-col gap-5 my-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="w-[30px] h-[30px] bg-[#eff4ff] rounded-full" />
						<div className="text-[#08123b] text-sm font-bold">{tier.title}</div>
					</div>
					<div
						onClick={() => setIsExpanded(!isExpanded)}
						className={`w-[38px] h-[38px] rounded-full flex items-center justify-center ${isCompleted ? "bg-[#08875c] pointer-events-none cursor-not-allowed" : "bg-[#eaeaea] cursor-pointer"}`}
					>
						{isCompleted ? (
							<CheckMarkIcon />
						) : (
							<DropdownIcon
								className={`transition-transform duration-200 ${isExpanded ? "" : "-rotate-90"}`}
							/>
						)}
					</div>
				</div>

				{isExpanded && (
					<div className="space-y-5">
						<div className="flex items-center justify-between w-full">
							<div className="text-[#414141] text-sm">{tier.text}</div>
							{tier.actionButton && (
								<button
									type="button"
									className="bg-[#465ec1] flex gap-0.5 items-center justify-center px-3 py-1 text-nowrap text-white rounded-md self-start disabled:opacity-50 disabled:cursor-not-allowed"
									onClick={() => {}}
								>
									Do Something
								</button>
							)}
						</div>

						<div className="flex gap-2">
							{tier.milestones.map((milestone, index) => (
								<label key={index} className="flex items-center gap-1.5 mr-6">
									<div className="relative w-5 h-5">
										{milestone.completed ? (
											<CheckIcon className="absolute inset-0" />
										) : (
											<div className="w-5 h-5 rounded-md border border-[#1836B2] bg-[#F9F5FF]" />
										)}
									</div>
									<div className="text-[#414141] text-sm w-full">
										{milestone.title}
									</div>
								</label>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
