import CheckIcon from "~/components/icons/CheckIcon";
import CheckMarkIcon from "~/components/icons/CheckMarkIcon";
import { Tier } from "./types";
import DropdownIcon from "~/components/icons/DropdownIcon";
import { useMemo, useState } from "react";
import { isTierCompleted } from "~/helpers";
import TierIcon from "~/components/icons/TierIcon";

export const TierComponent: React.FC<{ tier: Tier }> = ({ tier }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const isCompleted = useMemo(() => isTierCompleted(tier), [tier]);
	return (
		<div
			className={`h-full p-4 bg-white rounded-lg border-2 flex flex-col w-full my-4 ${isCompleted ? "border-[#08875D]" : "border-[#e1e6ef]"}`}
		>
			<div className="flex flex-col gap-5 my-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="w-[30px] h-[30px] bg-[#eff4ff] rounded-full flex items-center justify-center">
							<TierIcon tier={tier.icon} />
						</div>
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
						<div className="w-full space-y-5">
							{tier.actionButton ? (
								tier.action?.map((action, i) => (
									<div
										key={`${i}-${action.text}`}
										className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 w-full"
									>
										<div className="text-[#414141] text-sm">{action.text}</div>

										<div className="flex flex-row-reverse lg:flex-row items-center justify-between gap-5">
											{action.taskPill && (
												<section className="text-textLight text-sm md:text-base font-medium capitalize text-nowrap">
													{/* {renderStatus(selectedTask.status)} */}
													{action.taskPill}
												</section>
											)}
											<button
												type="button"
												className="bg-[#1836B2] flex gap-0.5 items-center justify-center px-3 py-1 text-nowrap text-white rounded-md self-start disabled:opacity-50 disabled:cursor-not-allowed"
												onClick={action.buttonAction}
												disabled={action.disableActionButton}
											>
												{action.buttonText}
											</button>
										</div>
									</div>
								))
							) : (
								<div className="text-[#414141] text-sm">{tier.text}</div>
							)}
						</div>

						<div className="flex flex-col md:flex-row gap-4 md:gap-2">
							{tier.milestones.map((milestone, index) => (
								<label
									key={index}
									className="flex items-center gap-1.5 py-1 md:mr-6 md:py-0"
								>
									<div className="relative w-5 h-5 flex-shrink-0">
										{milestone.completed ? (
											<CheckIcon className="absolute inset-0" />
										) : (
											<div className="w-5 h-5 rounded-md border border-[#1836B2] bg-[#F9F5FF]" />
										)}
									</div>
									<div className="text-[#414141] text-sm">{milestone.title}</div>
								</label>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
