import { useState } from "react";
import { useRouter } from "next/router";
import MessageModal from "~/components/Modal/MessageModal";
import SuccessIcon from "~/components/icons/SuccessIcon";
import Modal from "~/components/Modal";
import ExchangeTile from "~/components/AccountLayout/TradeCenter/ExchangeTile";
import ContentTab from "~/components/AccountLayout/ContentTab";
import { NestedTradeCenterLayout } from "../../..";
import FastConnection from "~/components/AccountLayout/TradeCenter/FastConnection";
import ManualConnection from "~/components/AccountLayout/TradeCenter/ManualConnection";
import { Category } from "~/config/enum";
import { useConnectManualTradingAccount } from "~/hooks/useConnectManualTradingAccount";
import useUserProfileData from "~/hooks/useUserProfileData";
import { ConnectionType } from "~/apis/handlers/trading-engine/enums";
import BackBtnIcon from "~/components/icons/BackBtnIcon";

const ExchangeConnection = () => {
	const router = useRouter();
	const { categoryName, platformName, platformId, imgUrl } = router.query;
	const [toggleSuccess, setToggleSuccess] = useState(false);
	const [isOpen, setIsOpen] = useState(true);

	const [apiKey, setApiKey] = useState<string | undefined>();
	const [secretKey, setSecretKey] = useState<string | undefined>();

	const tabs = [{ label: "Manual Connection" }, { label: "Fast Connection" }];
	const ipAddress = ["2345678901mj940485686505940400", "940485686505940l4002345678901m"];
	const ipString = ipAddress.join(", ");

	const handleModalClose = () => {
		router.push("..");
		setIsOpen(false);
	};

	const { userProfile } = useUserProfileData();
	const { connectManualTradingAccount, isError, isPending, error, isSuccess, data } =
		useConnectManualTradingAccount();

	// Make call to backend
	const handleManualConnection = () => {
		connectManualTradingAccount({
			userId: userProfile?.id as string,
			platformName: platformName as string,
			platformId: Number(platformId),
			apiKey: apiKey as string,
			apiSecret: secretKey as string,
			category: categoryName as Category,
			connectionType: ConnectionType.MANUAL,
		});
	};

	// Check success status to close modal and open success message
	if (isSuccess && data && !toggleSuccess) {
		setIsOpen(false); // Close initial modal
		setToggleSuccess(true); // Open success message modal
	}

	const handleSuccessClose = () => {
		setToggleSuccess(false);
	};
	const isSubmitDisabled = !secretKey || !apiKey || isPending;

	return (
		<>
			<Modal
				openModal={isOpen}
				width="md:w-[653px]"
				title="Connect Trading Account"
				backBtnIcon={<BackBtnIcon onClick={() => router.back()} />}
				onClose={handleModalClose}
			>
				<ExchangeTile imageUrl={imgUrl as string} />
				<ContentTab tabs={tabs}>
					<ManualConnection
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
			<MessageModal
				title={"Connection Success"}
				description={"Your account is now linked."}
				icon={SuccessIcon}
				openModal={toggleSuccess}
				onClose={handleSuccessClose}
			/>
		</>
	);
};

ExchangeConnection.getLayout = (page: React.ReactElement) => (
	<NestedTradeCenterLayout>{page}</NestedTradeCenterLayout>
);

export default ExchangeConnection;
