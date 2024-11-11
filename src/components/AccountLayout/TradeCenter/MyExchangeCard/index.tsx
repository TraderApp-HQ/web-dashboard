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
	IExchangeDropdownMenu,
	IUserAccountWithBalance,
} from "~/apis/handlers/trading-engine/interfaces";
import { AccountConnectionStatus } from "~/apis/handlers/trading-engine/enums";
import { Currency } from "~/config/enum";
import { useCreate } from "~/hooks/useCreate";
import { TradingEngineService } from "~/apis/handlers/trading-engine";

interface IConnectionStatus {
	isConnected: boolean;
	errorMessages: string[];
}

const ConnectionStatus: React.FC<IConnectionStatus> = ({ isConnected, errorMessages }) => {
	const [showTooltip, setShowTooltip] = useState(false);

	const toggleTooltip = useCallback(() => setShowTooltip((prev) => !prev), []);

	return (
		<div
			onMouseEnter={toggleTooltip}
			onMouseLeave={toggleTooltip}
			className={`flex px-2.5 py-2 rounded-lg justify-center items-center gap-2 ${
				isConnected ? "bg-[#F7FFFC]" : "bg-[#FFF7F8]"
			}`}
		>
			<div className="relative flex items-center">
				{isConnected ? <ConnectedIcon /> : <FailedIcon />}
				{!isConnected && showTooltip && errorMessages.length > 0 && (
					<div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-60 bg-white text-gray-800 text-sm rounded-lg shadow-lg p-3 z-10 border border-gray-200">
						<p className="font-bold text-red-600 mb-2">Connection Issues:</p>
						<ul className="list-disc list-inside space-y-1">
							{errorMessages.map((message, index) => (
								<li key={index} className="text-xs text-gray-700">
									{message}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
			<p
				className={`text-sm font-bold leading-none ${
					isConnected ? "text-emerald-700" : "text-rose-600"
				}`}
			>
				{isConnected ? "Connected" : "Failed"}
			</p>
		</div>
	);
};

const ExchangeDropdownMenu = ({ selectedAccountId, refetchAccounts }: IExchangeDropdownMenu) => {
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
			refetchAccounts();
		}
	}, [isAccountDeletedSuccessful, refetchAccounts]);

	const handleDeleteTradingAccount = useCallback(() => {
		deleteAccount({ id: selectedAccountId });
	}, [deleteAccount, selectedAccountId]);

	return (
		<DropdownMenu trigger={<DottedIcon />} position="left" direction="bottom">
			<DropdownMenuItem type="link" to="" className="pl-0 text-neutral-700">
				<div className="flex items-center gap-x-2">
					<ReplaceIcon />
					<span>Replace API Key</span>
				</div>
			</DropdownMenuItem>
			<DropdownMenuItem
				type="button"
				disabled={isPending}
				onClick={handleDeleteTradingAccount}
				className="pl-0 text-neutral-700"
			>
				<div className="flex items-center gap-x-2">
					<TrashIcon />
					<span>Delete</span>
				</div>
			</DropdownMenuItem>
		</DropdownMenu>
	);
};

const MyExchangeCard: React.FC<IUserAccountWithBalance> = ({
	plaformLogo,
	platformName,
	connectionStatus,
	category,
	balances,
	errorMessages,
	id,
	refetchAccounts,
}) => {
	const [account, setAccount] = useState<{ name: string; id: string }>();
	const [accountOptions, setAccountyOptions] = useState<ISelectBoxOption[]>([]);

	const filterUsdBalance = balances.filter((balance) => balance.currency === Currency.USDT);

	// format accounts to display on selectBox
	useEffect(() => {
		const options: ISelectBoxOption[] = filterUsdBalance.map((account) => ({
			displayText: account.accountType.toString(),
			value: account.availableBalance.toString(),
		}));
		setAccountyOptions(options);
	}, []);

	const handleAccountChange = useCallback((option: ISelectBoxOption) => {
		setAccount({ name: option.displayText, id: option.value });
	}, []);

	return (
		<Card className="relative">
			<div className="flex justify-between w-full">
				<div className="flex gap-x-2 items-center">
					<Image
						src={plaformLogo}
						alt={platformName}
						className="w-[45px] h-[45px] sm:w-[35px] sm:h-[35px]"
						width={45}
						height={45}
					/>
					<p className="text-neutral-700 text-sm md:text-xs font-semibold leading-none">
						{platformName}
					</p>
				</div>
				<ExchangeDropdownMenu selectedAccountId={id} refetchAccounts={refetchAccounts} />
			</div>

			<div className="flex flex-col gap-y-3 mt-2">
				<div className="flex justify-between items-center">
					<SelectBox
						containerStyle="-ml-4"
						option={accountOptions[0]}
						options={accountOptions}
						setOption={handleAccountChange}
						bgColor="bg-none"
					/>
					<p className="text-neutral-700 text-sm font-bold">{account?.id}</p>
				</div>

				<div className="border border-slate-100" />

				<div className="w-full flex justify-between items-center">
					<div className="px-2.5 py-2 rounded-lg justify-center items-center bg-[#E7ECFF] text-[#3E57BF]">
						{category}
					</div>
					<ConnectionStatus
						errorMessages={errorMessages}
						isConnected={connectionStatus === AccountConnectionStatus.CONNECTED}
					/>
				</div>
			</div>
		</Card>
	);
};

export default MyExchangeCard;
