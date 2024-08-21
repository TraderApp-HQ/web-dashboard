import MessageModal from "~/components/Modal/MessageModal";
import Button from "~/components/AccountLayout/Button";
import InputField from "~/components/common/InputField";
import SuccessIcon from "~/components/icons/SuccessIcon";
import { useState } from "react";
import myExchangeData from "~/data/wallet/data.json";
import { ISelectBoxOption } from "~/components/interfaces";
import SelectBox from "~/components/common/SelectBox";
import ExchangeCopyIcon from "~/components/icons/ExchangeCopyIcon";
import Modal from "~/components/Modal";
import { useRouter } from "next/router";
import ExchangeTile from "~/components/AccountLayout/TradeCenter/ExchangeTile";
import ContentTab from "~/components/AccountLayout/ContentTab";
import { NestedTradeCenterLayout } from "../..";
import OrderedListTile from "~/components/AccountLayout/OrderedListTile";
import Link from "next/link";

const ExchangeConnection = () => {
  const router = useRouter();

  const [toggleSuccess, setToggleSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const ipAddress = "2345678901mj940485686505940400";

  const [selectedExchange, setSelectedExchange] = useState<ISelectBoxOption | null>(null);
  const [apiKey, setApiKey] = useState<string | undefined>();
  const [secretKey, setSecretKey] = useState<string | undefined>();

  const tabs = [{ label: "Manual Connection" }, { label: "Fast Connection" }];

  const handleModalClose = () => {
    router.back();
    setIsOpen(false);
  };

  const exchangeOptions: ISelectBoxOption[] = myExchangeData.exchanges.map(
    (exchange) => ({
      displayText: exchange.name,
      value: exchange.id,
      imgUrl: exchange.logo,
    })
  );

  const handleSuccessClose = () => {
    setToggleSuccess(false);
  };

  const handleSelectedExchange = (exchange: ISelectBoxOption) => {
    setSelectedExchange(exchange);
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
  };

  const handleSecretKeyChange = (value: string) => {
    setSecretKey(value);
  };

  const handleExchangeCopy = () => {
    navigator.clipboard.writeText(ipAddress)
      .then(() => {
        console.log("IP address copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy IP address: ", err);
      });
  };

  // Validation function to check if any state value is empty
  const isSubmitDisabled = !(secretKey && apiKey && selectedExchange);

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
					{/* Manual Connection starts here  */}
					<div className="flex flex-col gap-y-4">
						<SelectBox
							isSearchable
							labelText="Exchange"
							options={exchangeOptions}
							placeholder="Select Exchange Channel"
							setOption={handleSelectedExchange}
						/>
						<InputField
							type="text"
							labelText="API Keys"
							props={{ name: "apikey" }}
							placeholder="Enter API Keys"
							onChange={handleApiKeyChange}
						/>
						<InputField
							type="text"
							labelText="Secret Keys"
							props={{ name: "secretkey" }}
							placeholder="Enter Secret Keys"
							onChange={handleSecretKeyChange}
						/>
						<div>
							<h3 className="text-gray-950 text-base font-bold uppercase">Important</h3>
							<span className="text-zinc-500 text-sm font-bold leading-tight">
								You must add TraderApp IP Address form below to your list of trusted
								IPs. Otherwise, if there are some days of inactivity, your IP key will be
								deleted by the exchange.
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
						<Link
							className="mt-2 flex justify-center text-blue-800"
							href={""}
						>
							How to Connect
						</Link>
					</div>
					{/* Manual Connection ends here */}

					{/* Fast Connection starts here */}
					<div> 
						<h3 className="text-center text-zinc-500 text-sm font-bold leading-tight px-1.5">
						TraderApp will receive access to your trading history and balance and will get the ability to replace orders on the exchange.
						</h3>
						<OrderedListTile items={["Click the “connect” button", "Log in to your Binance Account", "Confirm your connection to TraderApp"]} />

						<Button
							type="submit"
							fluid
							className="mt-2 flex justify-center"
							innerClassName="px-[20%] py-4"
						>
							Connect
						</Button>
						<Link
							className="my-8 flex justify-center text-blue-800"
							href={""}
						>
							<span className="text-base font-medium mr-1">Don't have an account? </span>
							<span className="text-base font-bold">Create one now.</span>
						</Link>
					</div>
					{/* Fast Connection ends here  */}
				</ContentTab>
				<MessageModal
					title={"Successful"}
					description={"connection successful"}
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
