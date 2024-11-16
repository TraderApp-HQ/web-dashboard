import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "~/components/Modal";
import ExchangeTile from "~/components/AccountLayout/TradeCenter/ExchangeTile";
import ContentTab from "~/components/AccountLayout/ContentTab";
import FastConnection from "~/components/AccountLayout/TradeCenter/FastConnection";
import ManualConnection from "~/components/AccountLayout/TradeCenter/ManualConnection";
import { Category } from "~/config/enum";
import { useConnectManualTradingAccount } from "~/hooks/useConnectManualTradingAccount";
import useUserProfileData from "~/hooks/useUserProfileData";
import { ConnectionType } from "~/apis/handlers/trading-engine/enums";
import BackBtnIcon from "~/components/icons/BackBtnIcon";
import { TradingEngineService } from "~/apis/handlers/trading-engine";
import { useCreate } from "~/hooks/useCreate";
import { IUserTradingAccount } from "~/apis/handlers/trading-engine/interfaces";
import Toast from "~/components/common/Toast";

interface IAccountConnection {
	categoryName: string;
	platformName: string;
	platformId: string;
	imgUrl: string;
	id?: string;
	fetchSuccess?: boolean;
	fetchAccount?: IUserTradingAccount;
	handleAccountConnection?: () => void;
}

const AccountConnection = ({
	categoryName,
	platformName,
	platformId,
	imgUrl,
	id,
	fetchSuccess,
	fetchAccount,
	handleAccountConnection,
}: IAccountConnection) => {
	const router = useRouter();
	const tradingEngineService = new TradingEngineService();
	const [isOpen, setIsOpen] = useState(true);

	const [apiKey, setApiKey] = useState<string | undefined>();
	const [secretKey, setSecretKey] = useState<string | undefined>();

	const tabs = [{ label: "Manual Connection" }, { label: "Fast Connection" }];
	const ipAddress = ["2345678901mj940485686505940400", "940485686505940l4002345678901m"];
	const ipString = ipAddress.join(", ");

	const handleModalClose = () => {
		router.back();
		setIsOpen(false);
	};

	const { userProfile } = useUserProfileData();

	const {
		mutate: updateManualTradingAccount,
		isError: isUpdateError,
		isPending: isUpdatePending,
		error: updateError,
		isSuccess: isUpdateSuccess,
		data: updateData,
	} = useCreate({
		mutationFn: tradingEngineService.updateUserTradingAccount.bind(tradingEngineService),
	});

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
			userId: userProfile?.id as string,
			platformName: platformName as string,
			platformId: Number(platformId),
			platformLogo: imgUrl as string,
			apiKey: apiKey as string,
			apiSecret: secretKey as string,
			category: categoryName as Category,
			connectionType: ConnectionType.MANUAL,
		};
		if (id) {
			updateManualTradingAccount({ id: id as string, accountData: payload });
		} else {
			connectManualTradingAccount(payload);
		}
	};

	useEffect(() => {
		if ((isAddSuccess && addData) || (isUpdateSuccess && updateData)) {
			setApiKey("");
			setSecretKey("");
		}
	}, [isAddSuccess, addData, isUpdateSuccess, updateData]);

	useEffect(() => {
		if (fetchAccount && fetchSuccess) {
			setApiKey(fetchAccount.apiKey);
			setSecretKey(fetchAccount.apiSecret);
		}
	}, [fetchSuccess, fetchAccount]);

	const isSubmitDisabled = !secretKey || !apiKey || isAddPending || isUpdatePending;
	const isError = id ? isUpdateError : isAddError;
	const error = id ? updateError : addError;

	return (
		<>
			<Modal
				openModal={isOpen}
				width="md:w-[653px]"
				title={id ? "Update Trading Account" : "Connect Trading Account"}
				backBtnIcon={<BackBtnIcon onClick={handleAccountConnection} />}
				onClose={handleModalClose}
			>
				<ExchangeTile imageUrl={imgUrl as string} />
				<ContentTab tabs={tabs}>
					<ManualConnection
						apiKey={apiKey}
						secretKey={secretKey}
						setApiKey={setApiKey}
						setSecretKey={setSecretKey}
						isSubmitDisabled={isSubmitDisabled}
						ipString={ipString}
						handleManualConnection={handleManualConnection}
						isError={isError}
						error={error}
					/>
					<FastConnection />
				</ContentTab>
			</Modal>
			{(isAddSuccess || isUpdateSuccess) && (
				<Toast
					type="success"
					variant="filled"
					title={id ? "Update Success" : "Connection Success"}
					message={
						id
							? "Your account connection has been updated."
							: "Your account is now linked."
					}
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
		</>
	);
};

export default AccountConnection;
