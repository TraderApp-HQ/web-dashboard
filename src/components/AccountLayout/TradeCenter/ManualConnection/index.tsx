import InputField from "~/components/common/InputField";
import Button from "~/components/AccountLayout/Button";
import Link from "next/link";
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
import Toast from "~/components/common/Toast";
// import CopyIcon from "~/components/icons/CopyIcon";
import IpAddressesList from "../IpAddressesList";

interface ManualConnectionProps {
	setApiKey?: (apiKey?: string) => void;
	setApiSecret?: (apiSecret?: string) => void;
	setPassphrase?: (passphrase?: string) => void;
	isSubmitDisabled: boolean;
	isLoading?: boolean;
	ipString: string;
	isError: boolean;
	error: Error | null;
	apiKey?: string;
	apiSecret?: string;
	passphrase?: string;
	isUpdateMode?: boolean;
	isRefreshMode?: boolean;
	handleManualConnection: () => void;
	isIpAddressWhitelistRequired: boolean;
	isPassphraseRequired?: boolean;
}

const ManualConnection: React.FC<ManualConnectionProps> = ({
	setApiKey,
	setApiSecret,
	setPassphrase,
	isSubmitDisabled,
	ipString,
	isError,
	error,
	apiKey,
	apiSecret,
	passphrase,
	isLoading,
	isUpdateMode,
	isRefreshMode,
	handleManualConnection,
	isIpAddressWhitelistRequired,
	isPassphraseRequired,
}) => {
	const { copyToClipboard, copyMessage } = useCopyToClipboard();

	const handleExchangeCopy = () => {
		copyToClipboard(ipString);
	};

	return (
		<div className="flex flex-col space-y-6">
			{!isRefreshMode && (
				<InputField
					value={apiKey}
					type="text"
					labelText="API Key"
					props={{ name: "apikey" }}
					placeholder="Enter API Key"
					onChange={setApiKey}
				/>
			)}
			{!isRefreshMode && (
				<InputField
					value={apiSecret}
					type="text"
					labelText="API Secret"
					props={{ name: "secretkey" }}
					placeholder="Enter API Secret"
					onChange={setApiSecret}
				/>
			)}
			{!isRefreshMode && isPassphraseRequired && (
				<InputField
					value={passphrase}
					type="text"
					labelText="Passphrase"
					props={{ name: "passphrase" }}
					placeholder="Enter Passphrase"
					onChange={setPassphrase}
				/>
			)}
			{isIpAddressWhitelistRequired && (
				<IpAddressesList ipString={ipString} handleCopy={handleExchangeCopy} />
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
				{!isUpdateMode ? "Connect" : isRefreshMode ? "Refresh" : "Replace"}
			</Button>
			{!isRefreshMode && (
				<Link className="mt-2 flex justify-center text-blue-800" href={""}>
					How to Connect
				</Link>
			)}
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
