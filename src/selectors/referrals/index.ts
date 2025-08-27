import { IReferrals } from "~/apis/handlers/users/interfaces";
import { ITableMobile, ITBody } from "~/components/common/DataTable/config";
import { getUserStatusToolTipText, renderDisplayItem, renderRank, renderStatus } from "~/helpers";
import { UsersCommunityHeadItems } from "./constants";
import { format } from "date-fns";

export function communityUsersDataTableSelector(referrals: IReferrals[]) {
	const tableHead = [...UsersCommunityHeadItems];
	const tableBody: ITBody = {
		tBodyRows: referrals.map((referral) => {
			const statusToolTipTextArray = getUserStatusToolTipText(referral.userId);

			return {
				tBodyColumns: [
					{
						displayItem: renderDisplayItem({
							itemText: {
								text: `${referral.userId.firstName} ${referral.userId.lastName}`,
							},
							useAvatar: true,
							avatarInitials:
								`${referral.userId.firstName[0]}${referral.userId.lastName[0]}`.toUpperCase(),
						}),
						styles: "flex justify-start px-4",
					},
					{
						displayItem: renderRank(referral.userId.referralRank),
					},
					{
						displayItem: renderDisplayItem({
							itemText: {
								text: String(referral.level),
							},
						}),
					},
					{
						displayItem: renderStatus(
							referral.userId.tradingStatus,
							{
								justify: "justify-center items-center gap-1",
							},
							true,
							statusToolTipTextArray,
						),
					},
					{
						displayItem: renderDisplayItem({
							itemText: { text: format(referral.userId.createdAt, "do MMMM yyyy") },
						}),
					},
				],
			};
		}),
	};

	return { tableHead, tableBody };
}

export function communityUsersMobileDataTableSelector(referrals: IReferrals[]) {
	const dataMobile: ITableMobile[] = referrals.map((referral) => {
		const statusToolTipTextArray = getUserStatusToolTipText(referral.userId);

		return {
			tHead: {
				displayItemTitle: renderDisplayItem({
					itemText: {
						text: `${referral.userId.firstName} ${referral.userId.lastName}`,
					},
					useAvatar: true,
					avatarInitials:
						`${referral.userId.firstName[0]}${referral.userId.lastName[0]}`.toUpperCase(),
				}),
				displayItemValue: "",
			},
			tBody: [
				{
					displayItemTitle: "Rank",
					displayItemValue: renderRank(referral.userId.referralRank),
				},
				{
					displayItemTitle: "Level",
					displayItemValue: `${referral.level}`,
					tooltip: { text: "Referral depth, Level 1 represents direct referrals" },
				},
				{
					displayItemTitle: "Status",
					displayItemValue: renderStatus(
						referral.userId.tradingStatus,
						{ justify: "justify-end" },
						false,
						statusToolTipTextArray,
					),
				},
				{
					displayItemTitle: "Registration Date",
					displayItemValue: format(referral.userId.createdAt, "do MMMM, yyyy"),
				},
			],
		};
	});

	return dataMobile;
}
