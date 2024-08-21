import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import MessageModal from "~/components/Modal/MessageModal";
import Button from "~/components/AccountLayout/Button";
import InputField from "~/components/common/InputField";
import SuccessIcon from "~/components/icons/SuccessIcon";
import SelectBox from "~/components/common/SelectBox";
import ExchangeCopyIcon from "~/components/icons/ExchangeCopyIcon";
import Modal from "~/components/Modal";
import ExchangeTile from "~/components/AccountLayout/TradeCenter/ExchangeTile";
import ContentTab from "~/components/AccountLayout/ContentTab";
import { NestedTradeCenterLayout } from "../..";
import OrderedListTile from "~/components/AccountLayout/OrderedListTile";
import useExchanges from "~/hooks/useExchanges";
import { ISelectBoxOption } from "~/components/interfaces";

const ExchangeConnection = () => {
	const router = useRouter();
	const [toggleSuccess, setToggleSuccess] = useState(false);
	const [isOpen, setIsOpen] = useState(true);

	const [selectedExchange, setSelectedExchange] = useState<ISelectBoxOption | null>(null);
	const [apiKey, setApiKey] = useState<string | undefined>();
	const [secretKey, setSecretKey] = useState<string | undefined>();

	const [exchangeOptions, setExchangeOptions] = useState<ISelectBoxOption[]>([]);
	const tabs = [{ label: "Manual Connection" }, { label: "Fast Connection" }];
	const ipAddress = "2345678901mj940485686505940400";

	const { data: exchanges, isSuccess: isExchangeSuccess } = useExchanges({
		page: 1,
		rowsPerPage: 10,
		orderBy: "asc",
		isTradingActive: true,
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

	const handleExchangeCopy = () => {
		navigator.clipboard
			.writeText(ipAddress)
			.then(() => {
				console.log("IP address copied to clipboard");
			})
			.catch((err) => {
				console.error("Failed to copy IP address: ", err);
			});
	};

	const ManualConnection = () => (
		<div className="flex flex-col gap-y-4">
			<SelectBox
				isSearchable
				labelText="Exchange"
				options={exchangeOptions}
				placeholder="Select Exchange Channel"
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
				icon={{ name: <ExchangeCopyIcon />, onClick: handleExchangeCopy }}
				labelText="IP Address"
				props={{ name: "ipaddress", disabled: true }}
				placeholder={ipAddress}
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
		</div>
	);

	const FastConnection = () => (
		<div>
			<h3 className="text-center text-zinc-500 text-sm font-bold leading-tight px-1.5">
				TraderApp will receive access to your trading history and balance and will get the
				ability to replace orders on the exchange.
			</h3>
			<OrderedListTile
				items={[
					"Click the “connect” button",
					"Log in to your Binance Account",
					"Confirm your connection to TraderApp",
				]}
			/>
			<Button
				type="submit"
				fluid
				className="mt-2 flex justify-center"
				innerClassName="px-[20%] py-4"
			>
				Connect
			</Button>
			<Link className="my-8 flex justify-center text-blue-800" href={""}>
				<span className="text-base font-medium mr-1">Don't have an account? </span>
				<span className="text-base font-bold">Create one now.</span>
			</Link>
		</div>
	);

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
					<ManualConnection />
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
