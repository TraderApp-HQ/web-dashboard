import { TierComponent } from "./TierComponent";
import { ProgressTrackerProps, Tier } from "./types";

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ title, body, tiers }) => {
	const calculateProgress = (tiers: Record<string, Tier>): number => {
		const totalTiers = Object.keys(tiers).length;
		const completedTiers = Object.values(tiers).filter((tier) =>
			tier.milestones.length
				? tier.milestones.every((milestone) => milestone.completed)
				: tier.completed,
		).length;
		return Math.round((completedTiers / totalTiers) * 100);
	};

	const progress = calculateProgress(tiers);

	return (
		<section className="mt-5 border border-[#DEE3F6] rounded-md bg-white text-[#3E57BF] px-4 py-4">
			{/* Header */}
			<h3 className="font-bold text-lg mb-1 text-[#102477]">{title}</h3>
			<p className="text-[#414141] font-light">{body}</p>

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
		</section>
	);
};

export default ProgressTracker;
