import React from "react";
import { ReferralRankType } from "~/components/common/ProgressTracker/types";
import { TierIcons } from "./tierIconMap";

interface TierIconProps {
	tier: ReferralRankType | string;
}

const TierIcon: React.FC<TierIconProps> = ({ tier }) => {
	const Icon = TierIcons[tier];
	return <Icon />;
};

export default TierIcon;
