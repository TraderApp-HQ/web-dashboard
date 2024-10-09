import { IReferrals } from "~/apis/handlers/users/interfaces";
import { ITBody } from "~/components/common/DataTable/config";
import { renderStatus } from "~/helpers";
import { UsersCommunityHeadItems } from "./constants";

export function communityUsersDataTableSelector(referrals: IReferrals[]) {
	const tableHead = [...UsersCommunityHeadItems];
	const tableBody: ITBody = {
		tBodyRows: referrals.map((referral) => ({
			tBodyColumns: [
				{ displayItem: `${referral.user.firstName} ${referral.user.lastName}` },
				{ displayItem: referral.user.email },
				{ displayItem: referral.user.role },
				{ displayItem: renderStatus(referral.user.status, { justify: "justify-start" }) },
			],
		})),
	};

	return { tableHead, tableBody };
}
