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
	TaskIcon,
	UserIcon,
	ArrowCircleIcon,
	ConnectIcon,
	MailIcon,
} from "./tiers";

export const TierIcons: Record<ReferralRankType | string, React.FC> = {
	[ReferralRank.TA_RECRUIT]: TARecruit,
	[ReferralRank.TA_LIEUTENANT]: TALieutenant,
	[ReferralRank.TA_CAPTAIN]: TACaptain,
	[ReferralRank.TA_MAJOR]: TAMAjor,
	[ReferralRank.TA_COLONEL]: TAColonel,
	[ReferralRank.TA_GENERAL]: TAGeneral,
	[ReferralRank.TA_FIELD_MARSHAL]: TAFieldMarshal,
	mail: MailIcon,
	connect: ConnectIcon,
	deposit: ArrowCircleIcon,
	task: TaskIcon,
	user: UserIcon,
};
