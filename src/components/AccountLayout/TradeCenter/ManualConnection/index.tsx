import SelectBox from "~/components/common/SelectBox";
import InputField from "~/components/common/InputField";
import Button from "~/components/AccountLayout/Button";
import Link from "next/link";
import { ISelectBoxOption } from "~/components/interfaces";
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
import Toast from "~/components/common/Toast";
import CopyIcon from "~/components/icons/CopyIcon";

interface ManualConnectionProps {
	selectedExchange: ISelectBoxOption | undefined;
	exchangeOptions: ISelectBoxOption[];
	setSelectedExchange: (option: ISelectBoxOption | undefined) => void;
	setApiKey: (apiKey: string | undefined) => void;
	setSecretKey: (secretKey: string | undefined) => void;
	isSubmitDisabled: boolean;
	ipString: string;
	isError: boolean;
	error: Error | null;
	isLoading: boolean;
}

const ManualConnection: React.FC<ManualConnectionProps> = ({
	isError,
	error,
	isLoading,
	selectedExchange,
	exchangeOptions,
	setSelectedExchange,
	setApiKey,
	setSecretKey,
	isSubmitDisabled,
	ipString,
}) => {
	const { copyToClipboard, copyMessage } = useCopyToClipboard();

	const handleExchangeCopy = () => {
		copyToClipboard(ipString);
	};

	return (
		<div className="flex flex-col gap-y-4">
			<SelectBox
				option={selectedExchange}
				isSearchable
				labelText="Exchange"
				options={exchangeOptions}
				placeholder={
					(isError && error?.message) ||
					(isLoading && "loading...") ||
					"Select Exchange Channel"
				}
				setOption={setSelectedExchange}
			/>
			<InputField
				type="text"
				labelText="API Keys"
				props={{ name: "apikey" }}
				placeholder="Enter API Keys"
				onChange={setApiKey}
			/>
			<InputField
				type="text"
				labelText="Secret Keys"
				props={{ name: "secretkey" }}
				placeholder="Enter Secret Keys"
				onChange={setSecretKey}
			/>
			<div>
				<h3 className="text-gray-950 text-base font-bold uppercase">Important</h3>
				<span className="text-zinc-500 text-sm font-bold leading-tight">
					You must add TraderApp IP Address from below to your list of trusted IPs.
					Otherwise, if there are some days of inactivity, your IP key will be deleted by
					the exchange.
				</span>
			</div>
			<InputField
				type="text"
				icon={{ name: <CopyIcon color="#1836B2" />, onClick: handleExchangeCopy }}
				labelText="IP Address"
				props={{ name: "ipaddress", disabled: true }}
				placeholder={ipString}
			/>
			<Button
				disabled={isSubmitDisabled}
				type="submit"
				fluid
				className="mt-2 flex justify-center"
				innerClassName="px-[20%] py-4 capitalize"
			>
				Connect
			</Button>
			<Link className="mt-2 flex justify-center text-blue-800" href={""}>
				How to Connect
			</Link>
			{copyMessage && (
				<Toast
					type="success"
					variant="outlined"
					title="Success"
					message={copyMessage}
					autoVanish
				/>
			)}
		</div>
	);
};

export default ManualConnection;
