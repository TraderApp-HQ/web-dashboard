import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MessageModal from "~/components/Modal/MessageModal";
import SuccessIcon from "~/components/icons/SuccessIcon";
import Modal from "~/components/Modal";
import ExchangeTile from "~/components/AccountLayout/TradeCenter/ExchangeTile";
import ContentTab from "~/components/AccountLayout/ContentTab";
import { NestedTradeCenterLayout } from "../..";
import useExchanges from "~/hooks/useExchanges";
import { ISelectBoxOption } from "~/components/interfaces";
import { TradeStatus } from "~/apis/handlers/assets/enums";
import FastConnection from "~/components/AccountLayout/TradeCenter/FastConnection";
import ManualConnection from "~/components/AccountLayout/TradeCenter/ManualConnection";

const ExchangeConnection = () => {
	const router = useRouter();
	const [toggleSuccess, setToggleSuccess] = useState(false);
	const [isOpen, setIsOpen] = useState(true);

	const [selectedExchange, setSelectedExchange] = useState<ISelectBoxOption | undefined>(
		undefined,
	);
	const [apiKey, setApiKey] = useState<string | undefined>();
	const [secretKey, setSecretKey] = useState<string | undefined>();

	const [exchangeOptions, setExchangeOptions] = useState<ISelectBoxOption[]>([]);
	const tabs = [{ label: "Manual Connection" }, { label: "Fast Connection" }];
	const ipAddress = ["2345678901mj940485686505940400", "940485686505940l4002345678901m"];
	const ipString = ipAddress.join(", ");

	const { data: exchanges, isSuccess: isExchangeSuccess } = useExchanges({
		status: TradeStatus.active,
	});

	useEffect(() => {
		if (isExchangeSuccess && exchanges) {
			const options = exchanges.map((exchange) => ({
				displayText: exchange.name.toString(),
				value: exchange.id,
				imgUrl: exchange.logo.toString(),
			}));
			setExchangeOptions(options);
		}
	}, [isExchangeSuccess, exchanges]);

	const isSubmitDisabled = !(secretKey && apiKey && selectedExchange);

	const handleModalClose = () => {
		router.back();
		setIsOpen(false);
	};

	const handleSuccessClose = () => setToggleSuccess(false);

	return (
		<>
			<Modal
				openModal={isOpen}
				width="md:w-[653px]"
				title="Connect New Exchange"
				onClose={handleModalClose}
			>
				<ExchangeTile imageUrl={selectedExchange?.imgUrl} />
				<ContentTab tabs={tabs}>
					<ManualConnection
						selectedExchange={selectedExchange}
						exchangeOptions={exchangeOptions}
						setSelectedExchange={setSelectedExchange}
						setApiKey={setApiKey}
						setSecretKey={setSecretKey}
						isSubmitDisabled={isSubmitDisabled}
						ipString={ipString}
					/>
					<FastConnection />
				</ContentTab>
				<MessageModal
					title={"Successful"}
					description={"Connection successful"}
					icon={SuccessIcon}
					openModal={toggleSuccess}
					onClose={handleSuccessClose}
				/>
			</Modal>
		</>
	);
};

ExchangeConnection.getLayout = (page: React.ReactElement) => (
	<NestedTradeCenterLayout>{page}</NestedTradeCenterLayout>
);

export default ExchangeConnection;
