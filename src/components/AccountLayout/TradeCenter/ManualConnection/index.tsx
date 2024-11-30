import InputField from "~/components/common/InputField";
import Button from "~/components/AccountLayout/Button";
import Link from "next/link";
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
import Toast from "~/components/common/Toast";
import CopyIcon from "~/components/icons/CopyIcon";
import { useEffect } from "react";

interface ManualConnectionProps {
	setApiKey: (apiKey: string | undefined) => void;
	setSecretKey: (secretKey: string | undefined) => void;
	isSubmitDisabled: boolean;
	isLoading?: boolean;
	ipString: string;
	isError: boolean;
	error: Error | null;
	apiKey?: string;
	secretKey?: string;
	isUpdateMode?: boolean;
	handleManualConnection: () => void;
	isIpAddressWhitelistRequired: boolean;
}

const ManualConnection: React.FC<ManualConnectionProps> = ({
	setApiKey,
	setSecretKey,
	isSubmitDisabled,
	ipString,
	isError,
	error,
	apiKey,
	secretKey,
	isLoading,
	isUpdateMode,
	handleManualConnection,
	isIpAddressWhitelistRequired,
}) => {
	const { copyToClipboard, copyMessage } = useCopyToClipboard();

	const handleExchangeCopy = () => {
		copyToClipboard(ipString);
	};

	useEffect(() => {}, [apiKey, secretKey]);

	return (
		<div className="flex flex-col space-y-6">
			<InputField
				value={apiKey}
				type="text"
				labelText="API Keys"
				props={{ name: "apikey" }}
				placeholder="Enter API Keys"
				onChange={setApiKey}
			/>
			<InputField
				value={secretKey}
				type="text"
				labelText="Secret Keys"
				props={{ name: "secretkey" }}
				placeholder="Enter Secret Keys"
				onChange={setSecretKey}
			/>
			{isIpAddressWhitelistRequired && (
				<div className="space-y-6">
					<div>
						<h3 className="text-gray-950 text-base font-bold uppercase">Important</h3>
						<span className="text-zinc-500 text-sm font-bold leading-tight">
							You must add TraderApp IP Addresses from below to your list of trusted
							IPs. Otherwise, if there are some days of inactivity, your API key will
							be deleted by the exchange.
						</span>
					</div>
					<InputField
						type="text"
						icon={{ name: <CopyIcon color="#1836B2" />, onClick: handleExchangeCopy }}
						labelText="IP Addresses"
						props={{ name: "ipaddress", disabled: true }}
						placeholder={ipString}
					/>
				</div>
			)}
			<Button
				disabled={isSubmitDisabled}
				type="submit"
				fluid
				className="mt-2 flex justify-center"
				innerClassName="px-[20%] py-4 capitalize"
				onClick={handleManualConnection}
				isLoading={isLoading}
			>
				{isUpdateMode ? "Update" : "Connect"}
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
			{isError && (
				<Toast
					type="error"
					variant="filled"
					title="Account Connection Error"
					message={error?.message ?? "Connection failed"}
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
		</div>
	);
};

export default ManualConnection;
