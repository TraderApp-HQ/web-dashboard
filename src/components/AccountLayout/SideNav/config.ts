/* eslint-disable @typescript-eslint/no-explicit-any */
import AggregateIcon from "~/components/icons/AggregateIcon";
import DashboardIcon from "~/components/icons/DashboardIcon";
import FinanceIcon from "~/components/icons/FinanceIcon";
import ReferralsIcon from "~/components/icons/ReferralsIcon";
import SettingIcon from "~/components/icons/SettingIcon";
import SignalManagementIcon from "~/components/icons/SignalManagementIcon";
import SignalsIcon from "~/components/icons/SignalsIcon";
import SystemManagementIcon from "~/components/icons/SystemManagementIcon";
import TaskCenterIcon from "~/components/icons/taskCenterIcon";
import TradeCenterIcon from "~/components/icons/TradeCenterIcon";
import UserIcon from "~/components/icons/UserIcon";
import WalletIcon from "~/components/icons/WalletIcon";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";

export interface SidenavLink {
	icon?: any;
	text: string;
	path: string;
}

export const NavLinks: SidenavLink[] = [
	{
		icon: DashboardIcon,
		text: "Dashboard",
		path: LAYOUT_ROUTES.account + ROUTES.dashboard.homepage,
	},
	{
		icon: SignalsIcon,
		text: "Signals",
		path: LAYOUT_ROUTES.account + ROUTES.signals,
	},
	{
		icon: TradeCenterIcon,
		text: "Trade Center",
		path: LAYOUT_ROUTES.account + ROUTES.tradeCenter.homepage,
	},
	{
		icon: WalletIcon,
		text: "Wallet",
		path: LAYOUT_ROUTES.account + ROUTES.wallet.homepage,
	},
	{
		icon: ReferralsIcon,
		text: "Reward Hub",
		path: LAYOUT_ROUTES.account + ROUTES.rewardHub,
	},
];

export const NavLinksExtras: SidenavLink[] = [
	{
		icon: SettingIcon,
		text: "Settings",
		path: LAYOUT_ROUTES.account + ROUTES.settings,
	},
];

export const AdminNavLinks: SidenavLink[] = [
	{
		icon: DashboardIcon,
		text: "Dashboard",
		path: LAYOUT_ROUTES.admin + ROUTES.dashboard.homepage,
	},
	{
		icon: FinanceIcon,
		text: "Finance Model",
		path: LAYOUT_ROUTES.admin + ROUTES.financemodel,
	},
	{
		icon: UserIcon,
		text: "User Management",
		path: LAYOUT_ROUTES.admin + ROUTES.usermanagement.homepage,
	},
	{
		icon: SignalManagementIcon,
		text: "Signal Management",
		path: LAYOUT_ROUTES.admin + ROUTES.signalmanagement,
	},
	{
		icon: TaskCenterIcon,
		text: "Task Center",
		path: LAYOUT_ROUTES.admin + ROUTES.taskcenter.home,
	},
	{
		icon: SystemManagementIcon,
		text: "System Management",
		path: LAYOUT_ROUTES.admin + ROUTES.systemmanagement,
	},
	{
		icon: AggregateIcon,
		text: "Aggregate View",
		path: LAYOUT_ROUTES.admin + ROUTES.aggregateview,
	},
];

export const AdminNavLinksExtras: SidenavLink[] = [
	{
		icon: SettingIcon,
		text: "Setting",
		path: LAYOUT_ROUTES.admin + ROUTES.settings,
	},
];
