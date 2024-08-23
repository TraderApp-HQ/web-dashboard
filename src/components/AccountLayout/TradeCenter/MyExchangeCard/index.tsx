import { useEffect, useState } from "react";
import Card from "../../Card";
import Image from "next/image";
import DropdownMenu, { DropdownMenuItem } from "../../DropdownMenu";
import DottedIcon from "~/components/icons/DottedIcon";
import ConnectedIcon from "~/components/icons/ConnectedIcon";
import FailedIcon from "~/components/icons/FailedIcon";
import TrashIcon from "~/components/icons/TrashIcon";
import ReplaceIcon from "~/components/icons/ReplaceIcon";
import { IExchangeConnection } from "~/pages/account/trade-center/exchanges";
import SelectBox from "~/components/common/SelectBox";
import { ISelectBoxOption } from "~/components/interfaces";
import accountData from "~/data/wallet/data.json";

interface IConnectionStatus {
	isConnected: boolean;
}

const ConnectionStatus: React.FC<IConnectionStatus> = ({ isConnected }) => (
	<div
		className={`flex px-2.5 py-2 rounded-lg justify-center items-center gap-2 ${
			isConnected ? "bg-[#F7FFFC]" : "bg-[#FFF7F8]"
		}`}
	>
		{isConnected ? <ConnectedIcon /> : <FailedIcon />}
		<p
			className={`text-sm font-bold leading-none ${
				isConnected ? "text-emerald-700" : "text-rose-600"
			}`}
		>
			{isConnected ? "Connected" : "Failed"}
		</p>
	</div>
);

const ExchangeDropdownMenu = () => (
	<DropdownMenu trigger={<DottedIcon />} position="left" direction="bottom">
		<DropdownMenuItem type="link" to="" className="pl-0 text-neutral-700">
			<div className="flex items-center gap-x-2">
				<ReplaceIcon />
				<span>Replace API Key</span>
			</div>
		</DropdownMenuItem>
		<DropdownMenuItem type="link" to="" className="pl-0 text-neutral-700">
			<div className="flex items-center gap-x-2">
				<TrashIcon />
				<span>Delete</span>
			</div>
		</DropdownMenuItem>
	</DropdownMenu>
);

const MyExchangeCard: React.FC<IExchangeConnection> = ({ logo, name, isConnected }) => {
	const [account, setAccount] = useState<{ name: string; id: string }>();
	const [accountOptions, setAccountyOptions] = useState<ISelectBoxOption[]>([]);

	// format accounts to display on selectBox
	useEffect(() => {
		const options: ISelectBoxOption[] = accountData.accountTypes.map((account) => ({
			displayText: account.type.toString(),
			value: account.balance.toString(),
		}));
		setAccountyOptions(options);
	}, []);

	const handleAccountChange = (option: ISelectBoxOption) => {
		setAccount({ name: option.displayText, id: option.value });
	};

	return (
		<Card className="relative">
			<div className="flex justify-between w-full">
				<div className="flex gap-x-2 items-center">
					<Image height={35} width={35} src={logo} alt={name} />
					<p className="text-neutral-700 text-xs font-semibold leading-none">{name}</p>
				</div>
				<ExchangeDropdownMenu />
			</div>

			<div className="flex flex-col gap-y-3 mt-2">
				<div className="flex justify-between items-center">
					<SelectBox
						containerStyle="-ml-4"
						defaultOption={accountOptions[1]}
						options={accountOptions}
						setOption={handleAccountChange}
						bgColor="bg-none"
					/>
					<p className="text-neutral-700 text-sm font-bold">{account?.id}</p>
				</div>

				<div className="border border-slate-100" />

				<div className="max-w-fit">
					<ConnectionStatus isConnected={isConnected} />
				</div>
			</div>
		</Card>
	);
};

export default MyExchangeCard;
