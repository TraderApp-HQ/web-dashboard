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
	isUserTradingAccountSuccess?: boolean;
	tradingAccount?: ITradingAccountInfo;
	connectionTypes: ConnectionType[];
	isIpAddressWhitelistRequired: boolean;
	handleAccountConnection?: () => void;
}

const AccountConnection: React.FC<IAccountConnection> = ({
	userId,
	categoryName,
	platformName,
	platformLogo,
	isUpdateMode,
	tradingAccount,
	handleAccountConnection,
	// connectionTypes,
	isIpAddressWhitelistRequired,
}) => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(true);

	const [apiKey, setApiKey] = useState<string | undefined>();
	const [secretKey, setSecretKey] = useState<string | undefined>();

	const tabs = [{ label: "Manual Connection" }, { label: "Fast Connection" }];
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
			apiKey: apiKey as string,
			apiSecret: secretKey as string,
			category: categoryName as Category,
			connectionType: ConnectionType.MANUAL,
		};
		connectManualTradingAccount(payload);
	};

	useEffect(() => {
		if (isAddSuccess && addData) {
			setApiKey("");
			setSecretKey("");
			router.push(
				`/account/trade-center/trading-accounts?success=true${isUpdateMode ? "&update=true" : ""}`,
			);
		}
	}, [isAddSuccess, addData]);

	useEffect(() => {
		if (tradingAccount) {
			setApiKey(tradingAccount.apiKey);
			setSecretKey(tradingAccount.apiSecret);
		}
	}, [tradingAccount]);

	const isSubmitDisabled = !secretKey || !apiKey || isAddPending;

	return (
		<>
			<Modal
				openModal={isOpen}
				width="md:w-[653px]"
				title={isUpdateMode ? "Update Trading Account" : "Connect Trading Account"}
				backBtnIcon={<BackBtnIcon onClick={handleAccountConnection} />}
				onClose={handleModalClose}
				showBackButton={isUpdateMode ? false : true}
			>
				<ExchangeTile imageUrl={platformLogo} />
				<ContentTab tabs={tabs}>
					<ManualConnection
						apiKey={apiKey}
						secretKey={secretKey}
						setApiKey={setApiKey}
						setSecretKey={setSecretKey}
						isSubmitDisabled={isSubmitDisabled}
						ipString={ipString}
						handleManualConnection={handleManualConnection}
						isError={isAddError}
						error={addError}
						isLoading={isAddPending}
						isUpdateMode={isUpdateMode}
						isIpAddressWhitelistRequired={isIpAddressWhitelistRequired}
					/>
					<FastConnection />
				</ContentTab>
			</Modal>
		</>
	);
};

export default AccountConnection;
