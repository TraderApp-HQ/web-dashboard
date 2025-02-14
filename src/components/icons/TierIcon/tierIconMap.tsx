import React from "react";
import { ReferralRankType } from "~/components/common/ProgressTracker/types";
import { ReferralRank } from "~/config/constants";
import {
	TACaptain,
	TAColonel,
	TAFieldMarshal,
	TAGeneral,
	TALieutenant,
	TAMAjor,
	TARecruit,
} from "./tiers";

export const TierIcons: Record<ReferralRankType, React.FC> = {
	[ReferralRank.TA_RECRUIT]: TARecruit,
	[ReferralRank.TA_LIEUTENANT]: TALieutenant,
	[ReferralRank.TA_CAPTAIN]: TACaptain,
	[ReferralRank.TA_MAJOR]: TAMAjor,
	[ReferralRank.TA_COLONEL]: TAColonel,
	[ReferralRank.TA_GENERAL]: TAGeneral,
	[ReferralRank.TA_FIELD_MARSHAL]: TAFieldMarshal,
};
