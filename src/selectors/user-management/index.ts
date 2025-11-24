import type { ITBody } from "~/components/common/DataTable/config";
import { UsersTableHeadItems } from "./constants";
import { ROUTES } from "~/config/constants";
import type { IUserProfile } from "~/apis/handlers/users/interfaces";
import { getUserStatusToolTipText, renderStatus } from "~/helpers";
import EditIcon from "~/components/icons/EditIcon";

export function usersDataTableSelector(users: IUserProfile[]) {
	const tableHead = [...UsersTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: users.map((user) => {
			const statusToolTipTextArray = getUserStatusToolTipText(user);

			return {
				tBodyColumns: [
					{ displayItem: `${user.firstName} ${user.lastName}` },
					{ displayItem: user.email },
					{ displayItem: user.role },
					{
						displayItem: renderStatus(
							user.tradingStatus,
							{ justify: "justify-start" },
							true,
							statusToolTipTextArray,
						),
					},
				],
				actions: [
					{
						label: "View",
						url: `user-management/${user.id}${ROUTES.usermanagement.details}`,
					},
					{
						label: "",
						url: `user-management/${user.id}${ROUTES.usermanagement.edit}`,
						icon: EditIcon,
					},
				],
			};
		}),
	};

	return { tableHead, tableBody };
}
