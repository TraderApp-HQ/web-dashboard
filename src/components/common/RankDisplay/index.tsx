import React from "react";
import { ReferralRankType } from "../ProgressTracker/types";
import { ReferralRank } from "~/config/constants";

interface IRankDisplay {
	rank: ReferralRankType | null;
}

const RankDisplay: React.FC<IRankDisplay> = ({ rank }) => {
	let rankStyle: string;

	switch (rank) {
		case ReferralRank.TA_RECRUIT:
			rankStyle = "bg-[#EFF4FF] text-[#102476]";
			break;

		case ReferralRank.TA_LIEUTENANT:
			rankStyle = "bg-[#FFF7EE] text-[#B56503]";
			break;

		case ReferralRank.TA_CAPTAIN:
			rankStyle = "bg-[#FAF6FF] text-[#3F047E]";
			break;

		case ReferralRank.TA_MAJOR:
			rankStyle = "bg-[#FCF6FF] text-[#7E0472]";
			break;

		case ReferralRank.TA_COLONEL:
			rankStyle = "bg-[#F6FDFF] text-[#044B7E]";
			break;

		case ReferralRank.TA_GENERAL:
			rankStyle = "bg-[#FCFFF6] text-[#7E7E04]";
			break;

		case ReferralRank.TA_FIELD_MARSHAL:
			rankStyle = "bg-[#FFF6F6] text-[#7E0406]";
			break;

		default:
			rankStyle = "";
	}

	return (
		<div className={`flex justify-end md:justify-center items-center}`}>
			{rank ? (
				<div
					className={`flex px-7 py-2 font-black rounded-lg justify-center items-center gap-2 ${rankStyle}`}
				>
					{rank}
				</div>
			) : (
				"---"
			)}
		</div>
	);
};

export default RankDisplay;
