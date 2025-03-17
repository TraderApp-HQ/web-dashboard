import { ITHead } from "~/components/common/DataTable/config";

export const UsersCommunityHeadItems: ITHead[] = [
	{
		displayItem: "Full Name",
		styles: "text-left w-1/4 px-4",
	},
	{ displayItem: "Rank", styles: "text-center w-1/6" },
	{
		displayItem: "Level",
		styles: "text-center w-1/6",
		tooltip: {
			text: "Referral depth, Level 1 represents direct referrals",
		},
	},
	{ displayItem: "Status", styles: "text-center w-1/6" },
	{ displayItem: "Registration Date", styles: "text-center w-1/4" },
];
