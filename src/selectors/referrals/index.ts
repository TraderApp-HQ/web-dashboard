import { IReferrals } from "~/apis/handlers/users/interfaces";
import { ITableMobile, ITBody } from "~/components/common/DataTable/config";
import { renderDisplayItem, renderStatus } from "~/helpers";
import { UsersCommunityHeadItems } from "./constants";

export function communityUsersDataTableSelector(referrals: IReferrals[]) {
	const tableHead = [...UsersCommunityHeadItems];
	const tableBody: ITBody = {
		tBodyRows: referrals.map((referral) => ({
			tBodyColumns: [
				{ displayItem: `${referral.user.firstName} ${referral.user.lastName}` },
				{ displayItem: referral.user.email },
				{ displayItem: referral.level },
				{ displayItem: renderStatus(referral.user.status, { justify: "justify-start" }) },
				{ displayItem: referral.user.createdAt },
			],
		})),
	};

	return { tableHead, tableBody };
}

export function communityUsersMobileDataTableSelector(referrals: IReferrals[]) {
	const dataMobile: ITableMobile[] = referrals.map((referral) => ({
		tHead: {
			displayItemTitle: renderDisplayItem({
				itemText: {
					text: referral.user.firstName + " " + referral.user.lastName,
					style: "text-base font-normal",
				},
				itemSubText: { text: referral.user.email },
			}),
			displayItemValue: "",
		},
		tBody: [
			{
				displayItemTitle: "Level in Referral Tree",
				displayItemValue: `${referral.level}`,
			},
			{
				displayItemTitle: "Status",
				displayItemValue: renderStatus(referral.user.status, { justify: "justify-end" }),
			},
			{
				displayItemTitle: "Registration Date",
				displayItemValue: referral.user.createdAt,
			},
		],
	}));

	return dataMobile;
}
