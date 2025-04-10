import { isTierCompleted } from "~/helpers";
import { TierComponent } from "./TierComponent";
import { ProgressTrackerProps } from "./types";
import { useMemo } from "react";

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
	title,
	body,
	tiers,
	isLoading,
	loadingComponent: LoadingComponent,
	isError,
	errorComponent: ErrorComponent,
}) => {
	const progress = useMemo(() => {
		const totalTiers = Object.keys(tiers).length;
		if (!totalTiers) return 0;
		const completedTiers = Object.values(tiers).filter(isTierCompleted).length;
		return Math.round((completedTiers / totalTiers) * 100);
	}, [tiers]);

	if (isLoading && LoadingComponent) {
		return <LoadingComponent />;
	}

	return (
		<section className="mt-5 border border-[#DEE3F6] rounded-md bg-white text-[#3E57BF] p-5">
			{/* Header */}
			<h3 className="font-bold text-lg mb-1 text-[#102477]">{title}</h3>
			<p className="text-[#414141] font-light">{body}</p>

			{!isLoading && isError && ErrorComponent ? (
				<ErrorComponent />
			) : (
				<>
					{/* Progress Bar */}
					<div className="progressContainer">
						<div className="bg-[#EEEDEC] rounded-md h-3 w-full my-2">
							<div
								className="bg-[#DA7B07] rounded-md h-3"
								style={{ width: `${progress}%`, height: "13px" }}
							></div>
						</div>
						<p className="text-right text-[#344054]">{progress}% Completed</p>
					</div>

					{/* Tiers */}
					<div>
						{Object.entries(tiers).map(([tierKey, tier]) => (
							<TierComponent tier={tier} key={tierKey} />
						))}
					</div>
				</>
			)}
		</section>
	);
};

export default ProgressTracker;
