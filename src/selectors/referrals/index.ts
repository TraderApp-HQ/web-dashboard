import { IUserProfile } from "~/apis/handlers/users/interfaces";
import { ITBody } from "~/components/common/DataTable/config";
import { renderStatus } from "~/helpers";
import { UsersCommunityHeadItems } from "./constants";

export function communityUsersDataTableSelector(users: IUserProfile[]) {
	const tableHead = [...UsersCommunityHeadItems];
	const tableBody: ITBody = {
		tBodyRows: users.map((user) => ({
			tBodyColumns: [
				{ displayItem: `${user.firstName} ${user.lastName}` },
				{ displayItem: user.email },
				{ displayItem: user.role },
				{ displayItem: renderStatus(user.status, { justify: "justify-start" }) },
			],
		})),
	};

	return { tableHead, tableBody };
}
