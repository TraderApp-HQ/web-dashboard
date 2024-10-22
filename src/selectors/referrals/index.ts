import { IReferrals } from "~/apis/handlers/users/interfaces";
import { ITableMobile, ITBody } from "~/components/common/DataTable/config";
import { renderDisplayItem, renderStatus } from "~/helpers";
import { UsersCommunityHeadItems } from "./constants";
import { format } from "date-fns";

export function communityUsersDataTableSelector(referrals: IReferrals[]) {
	const tableHead = [...UsersCommunityHeadItems];
	const tableBody: ITBody = {
		tBodyRows: referrals.map((referral) => ({
			tBodyColumns: [
				{
					displayItem: renderDisplayItem({
						itemText: {
							text: `${referral.userId.firstName} ${referral.userId.lastName}`,
						},
					}),
				},
				{
					displayItem: renderDisplayItem({
						itemText: { text: referral.userId.referralRank },
					}),
				},
				{
					displayItem: renderDisplayItem({
						itemText: {
							text: String(referral.level),
						},
					}),
				},
				{
					displayItem: renderStatus(referral.userId.status, {
						justify: "justify-center",
					}),
				},
				{
					displayItem: renderDisplayItem({
						itemText: { text: format(referral.userId.createdAt, "do MMMM yyyy") },
					}),
				},
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
					text: referral.userId.firstName + " " + referral.userId.lastName,
					style: "text-base font-normal",
				},
				itemSubText: { text: referral.userId.email },
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
				displayItemValue: renderStatus(referral.userId.status, { justify: "justify-end" }),
			},
			{
				displayItemTitle: "Registration Date",
				displayItemValue: format(referral.userId.createdAt, "do MMMM yyyy"),
			},
		],
	}));

	return dataMobile;
}
