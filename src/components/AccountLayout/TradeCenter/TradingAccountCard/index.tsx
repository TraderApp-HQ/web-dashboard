import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "../../Card";
import Image from "next/image";
import DropdownMenu, { DropdownMenuItem } from "../../DropdownMenu";
import DottedIcon from "~/components/icons/DottedIcon";
import ConnectedIcon from "~/components/icons/ConnectedIcon";
import FailedIcon from "~/components/icons/FailedIcon";
import TrashIcon from "~/components/icons/TrashIcon";
import ReplaceIcon from "~/components/icons/ReplaceIcon";
import SelectBox from "~/components/common/SelectBox";
import { ISelectBoxOption } from "~/components/interfaces";
import {
	ITradingAccountDropdownMenu,
	ITradingAccountInfo,
} from "~/apis/handlers/trading-engine/interfaces";
import { AccountConnectionStatus } from "~/apis/handlers/trading-engine/enums";
import { ColourTheme, Currency } from "~/config/enum";
import { useCreate } from "~/hooks/useCreate";
import { TradingEngineService } from "~/apis/handlers/trading-engine";
import { useRouter } from "next/router";
import {
	AccountTypeValues,
	TradingPlatformCategoryValues,
	TradingPlatformValues,
} from "~/config/constants";
import StatusPill from "~/components/common/StatusPill";
import RefreshIcon from "~/components/icons/RefreshIcon";
import DeleteModal from "~/components/Modal/DeleteModal";

interface IConnectionStatus {
	isConnected: boolean;
	errorMessages: string[];
	connectionHeadingText?: string;
	connectionText?: string;
}

interface ITradingAccountCardProps {
	tradingAccount: ITradingAccountInfo;
	refetchTradingAccounts: () => void;
}

const TradingAccountCard: React.FC<ITradingAccountCardProps> = ({
	tradingAccount,
	refetchTradingAccounts,
}) => {
	const [account, setAccount] = useState<{ name: string; value: string }>();
	const [accountOptions, setAccountOptions] = useState<ISelectBoxOption[]>([]);

	const filterUsdBalance = tradingAccount.balances.filter(
		(balance) => balance.currency === Currency.USDT,
	);

	// format accounts to display on selectBox
	useEffect(() => {
		const options: ISelectBoxOption[] = filterUsdBalance.map((account) => ({
			displayText: AccountTypeValues[account.accountType],
			value: `${account.availableBalance.toFixed(2)} ${account.currency}`,
		}));
		setAccountOptions(options);
	}, []);

	const handleAccountChange = useCallback((option: ISelectBoxOption) => {
		setAccount({ name: option.displayText, value: option.value.toString() });
	}, []);

	return (
		<Card className="relative !p-4 !min-w-[324px]">
			<div className="flex justify-between w-full">
				<div className="flex gap-x-2 items-center">
					<Image
						src={tradingAccount.platformLogo}
						alt={tradingAccount.platformName}
						className="w-[45px] h-[45px] sm:w-[35px] sm:h-[35px]"
						width={45}
						height={45}
					/>
					<p className="text-neutral-700 text-base md:text-base font-bold leading-none">
						{TradingPlatformValues[tradingAccount.platformName]}
					</p>
				</div>
				<TradingAccountDropdownMenu
					userId={tradingAccount.userId}
					platformName={tradingAccount.platformName}
					refetchUserTradingAccounts={refetchTradingAccounts}
				/>
			</div>

			<div className="flex flex-col gap-y-3 mt-2">
				<div className="flex justify-between items-center">
					<SelectBox
						containerStyle="-ml-4"
						option={accountOptions[0]}
						options={accountOptions}
						setOption={handleAccountChange}
						bgColor="bg-none"
						fontStyles="text-sm text-[#414141] font-medium"
					/>
					<p className="text-neutral-700 text-sm font-bold">{account?.value}</p>
				</div>

				<div className="border-[0.5px] border-slate-100" />

				<div className="w-full flex justify-between items-center">
					<StatusPill
						status={TradingPlatformCategoryValues[tradingAccount.category]}
						theme={ColourTheme.REVIEW}
						bullet={false}
					/>
					<ConnectionStatus
						errorMessages={tradingAccount.errorMessages}
						isConnected={
							tradingAccount.connectionStatus === AccountConnectionStatus.CONNECTED
						}
					/>
				</div>
			</div>
		</Card>
	);
};

export const ConnectionStatus: React.FC<IConnectionStatus> = ({
	isConnected,
	errorMessages,
	connectionText,
	connectionHeadingText = "Connection Status",
}) => {
	const [showTooltip, setShowTooltip] = useState(false);

	const toggleTooltip = useCallback(() => setShowTooltip((prev) => !prev), []);

	return (
		<div
			onMouseEnter={toggleTooltip}
			onMouseLeave={toggleTooltip}
			className={`relative flex px-2.5 py-2 rounded-lg justify-center items-center gap-2 ${
				isConnected ? "bg-[#F7FFFC]" : "bg-[#FFF7F8]"
			}`}
		>
			{isConnected ? <ConnectedIcon /> : <FailedIcon />}
			{!isConnected && showTooltip && errorMessages.length > 0 && (
				<div className="absolute top-full right-0 mt-2 w-60 bg-white text-gray-800 text-sm rounded-lg shadow-lg p-3 z-10 border border-gray-200 text-left">
					<p className="font-bold text-red-600 mb-2 capitalize">
						{connectionHeadingText}:
					</p>
					<ul className="list-disc list-inside space-y-1">
						{errorMessages.map((message, index) => (
							<li key={index} className="text-xs text-gray-700 text-wrap">
								{message}
							</li>
						))}
					</ul>
				</div>
			)}
			<p
				className={`text-sm font-bold leading-none ${
					isConnected ? "text-emerald-700" : "text-rose-600"
				}`}
			>
				{isConnected ? (connectionText ?? "Connected") : (connectionText ?? "Failed")}
			</p>
		</div>
	);
};

const TradingAccountDropdownMenu: React.FC<ITradingAccountDropdownMenu> = ({
	userId,
	platformName,
	refetchUserTradingAccounts,
}) => {
	const [toggleDeleteModal, setToggleDeleteModal] = useState<boolean>(false);
	const router = useRouter();
	const tradingEngineService = useMemo(() => new TradingEngineService(), []);
	const {
		mutate: deleteAccount,
		isPending,
		isSuccess: isAccountDeletedSuccessful,
	} = useCreate({
		mutationFn: tradingEngineService.deleteUserTradingAccount.bind(tradingEngineService),
	});

	useEffect(() => {
		if (isAccountDeletedSuccessful) {
			refetchUserTradingAccounts();
		}
	}, [isAccountDeletedSuccessful, refetchUserTradingAccounts]);

	const handleDeleteTradingAccount = useCallback(() => {
		deleteAccount({ userId, platformName });
	}, [deleteAccount, userId, platformName]);

	const handleDeleteTaskModalOpen = () => setToggleDeleteModal(true);
	const handleDeleteModalClose = () => setToggleDeleteModal(false);
	const handleDeleteTask = () => {
		handleDeleteTradingAccount();
		if (isAccountDeletedSuccessful) handleDeleteModalClose();
	};

	return (
		<>
			<DropdownMenu
				trigger={<DottedIcon />}
				position="left"
				direction="bottom"
				className="!p-2"
			>
				<DropdownMenuItem
					type="button"
					onClick={async () => {
						await router.replace("/account/trade-center/trading-accounts", undefined);
						router.push(
							`trading-accounts/connect?platformName=${platformName}&refresh=true`,
						);
					}}
					className="pl-0 text-neutral-700"
				>
					<div className="flex items-center space-x-2 min-w-44">
						<RefreshIcon />
						<span>Refresh Connection</span>
					</div>
				</DropdownMenuItem>
				<DropdownMenuItem
					type="button"
					onClick={async () => {
						await router.replace("/account/trade-center/trading-accounts", undefined);
						router.push(`trading-accounts/connect?platformName=${platformName}`);
					}}
					className="pl-0 text-neutral-700"
				>
					<div className="flex items-center space-x-2 min-w-40">
						<ReplaceIcon />
						<span>Replace API Keys</span>
					</div>
				</DropdownMenuItem>
				<DropdownMenuItem
					type="button"
					disabled={isPending}
					onClick={handleDeleteTaskModalOpen}
					className="pl-0 text-neutral-700"
				>
					<div className="flex items-center space-x-2 min-w-40">
						<TrashIcon />
						<span>Delete Account</span>
					</div>
				</DropdownMenuItem>
			</DropdownMenu>

			{/* Delete modal */}
			<DeleteModal
				title={"Delete Trading Account"}
				description={"Are you sure you want to delete this trading account?"}
				btnConfirm={handleDeleteTask}
				btnCancle={handleDeleteModalClose}
				openModal={toggleDeleteModal}
				onClose={handleDeleteModalClose}
				isDeleting={isPending}
			/>
		</>
	);
};

export default TradingAccountCard;
