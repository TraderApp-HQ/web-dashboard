import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "~/components/Modal";
import ExchangeTile from "~/components/AccountLayout/TradeCenter/ExchangeTile";
import ContentTab from "~/components/AccountLayout/ContentTab";
import FastConnection from "~/components/AccountLayout/TradeCenter/FastConnection";
import ManualConnection from "~/components/AccountLayout/TradeCenter/ManualConnection";
import { Category } from "~/config/enum";
import { useConnectManualTradingAccount } from "~/hooks/useConnectManualTradingAccount";
import { ConnectionType, TradingPlatform } from "~/apis/handlers/trading-engine/enums";
import BackBtnIcon from "~/components/icons/BackBtnIcon";
import { ITradingAccountInfo } from "~/apis/handlers/trading-engine/interfaces";

interface IAccountConnection {
	userId: string;
	categoryName: Category;
	platformName: TradingPlatform;
	platformLogo: string;
	isUpdateMode?: boolean;
	isRefreshMode?: boolean;
	isUserTradingAccountSuccess?: boolean;
	userTradingAccount?: ITradingAccountInfo;
	connectionTypes: ConnectionType[];
	isIpAddressWhitelistRequired: boolean;
	isPassphraseRequired: boolean;
	handleAccountConnection?: () => void;
}

const AccountConnection: React.FC<IAccountConnection> = ({
	userId,
	categoryName,
	platformName,
	platformLogo,
	isUpdateMode,
	isRefreshMode,
	// userTradingAccount,
	handleAccountConnection,
	connectionTypes,
	isIpAddressWhitelistRequired,
	isPassphraseRequired,
}) => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(true);

	const [apiKey, setApiKey] = useState<string>();
	const [apiSecret, setApiSecret] = useState<string>();
	const [passphrase, setPassphrase] = useState<string>();
	const [isFastConnectionSupported, setIsFastConnectionSupported] = useState(false);
	const [tabs, setTabs] = useState<{ label: string }[]>([{ label: "Manual Connection" }]);
	const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false);

	const ipAddress = ["18.201.27.185"];
	const ipString = ipAddress.join(" ");

	const handleModalClose = () => {
		router.push("/account/trade-center/trading-accounts");
		setIsOpen(false);
	};

	const {
		connectManualTradingAccount,
		isError: isAddError,
		isPending: isAddPending,
		error: addError,
		isSuccess: isAddSuccess,
		data: addData,
	} = useConnectManualTradingAccount();

	const handleManualConnection = () => {
		const payload = {
			userId: userId,
			platformName: platformName as string,
			apiKey: apiKey,
			apiSecret: apiSecret,
			passphrase,
			category: categoryName as Category,
			connectionType: ConnectionType.MANUAL,
			isRefreshMode,
		};
		connectManualTradingAccount(payload);
	};

	useEffect(() => {
		if (isAddSuccess && addData) {
			setApiKey(undefined);
			setApiSecret(undefined);
			setPassphrase(undefined);
			router.push(
				`/account/trade-center/trading-accounts?success=true${isUpdateMode ? "&update=true" : ""}`,
			);
		}
	}, [isAddSuccess, addData]);

	useEffect(() => {
		const isFastConnectionSupported = connectionTypes?.includes(ConnectionType.FAST);
		setIsFastConnectionSupported(isFastConnectionSupported);

		if (isFastConnectionSupported) {
			setTabs([{ label: "Manual Connection" }, { label: "Fast Connection" }]);
		} else {
			setTabs([{ label: "Manual Connection" }]);
		}
	}, [connectionTypes]);

	useEffect(() => {
		if (isPassphraseRequired) {
			setIsSubmitDisabled(
				(!apiKey || !apiSecret || !passphrase || isAddPending) && !isRefreshMode,
			);
		} else {
			setIsSubmitDisabled((!apiKey || !apiSecret || isAddPending) && !isRefreshMode);
		}
	}, [apiKey, apiSecret, passphrase, isAddPending, isPassphraseRequired, isRefreshMode]);

	return (
		<>
			<Modal
				openModal={isOpen}
				width="md:w-[653px]"
				title={
					!isUpdateMode
						? "Connect Trading Account"
						: isRefreshMode
							? "Refresh Connection"
							: "Replace API Keys"
				}
				backBtnIcon={<BackBtnIcon onClick={handleAccountConnection} />}
				onClose={handleModalClose}
				showBackButton={isUpdateMode ? false : true}
			>
				<ExchangeTile imageUrl={platformLogo} />

				<ContentTab tabs={tabs}>
					<ManualConnection
						apiKey={apiKey}
						apiSecret={apiSecret}
						passphrase={passphrase}
						setApiKey={setApiKey}
						setApiSecret={setApiSecret}
						setPassphrase={setPassphrase}
						isSubmitDisabled={isSubmitDisabled}
						ipString={ipString}
						handleManualConnection={handleManualConnection}
						isError={isAddError}
						error={addError}
						isLoading={isAddPending}
						isUpdateMode={isUpdateMode}
						isRefreshMode={isRefreshMode}
						isIpAddressWhitelistRequired={isIpAddressWhitelistRequired}
						isPassphraseRequired={isPassphraseRequired}
					/>
					{!isRefreshMode && isFastConnectionSupported && <FastConnection />}
				</ContentTab>
			</Modal>
		</>
	);
};

export default AccountConnection;
