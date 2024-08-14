import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import type { Asset } from "~/lib/types";
import Button from "~/components/common/old/Button";
import PlusIcon from "~/components/icons/PlusIcon";
import UploadButton from "~/components/AccountLayout/UploadButton";
import { useDropzone } from "react-dropzone";
import data from "./signal.json";
import Modal from "~/components/Modal";
import InputField from "~/components/common/InputField";
import IconButton from "~/components/AccountLayout/IconButton";
import MessageModal from "~/components/Modal/MessageModal";
import CustomSelect from "~/components/Wallet/CustomSelect";
import SuccessIcon from "~/components/icons/SuccessIcon";
import { handleKeyDown } from "~/lib/utils";

export default function CreateSignal() {
	const [toggleSuccess, setToggleSuccess] = useState(false);
	const [isOpen, setIsOpen] = useState(true);

	const router = useRouter();

	const [asset, setAsset] = useState<Asset>(data.assets[0]);
	const [timeFrame, setTimeframe] = useState<Asset>(data.timeFrame[0]);
	const [signalImage, setSignalImage] = useState("");
	const [targetProfits, setTargetProfits] = useState<string[]>([]);
	const [entryPrice, setEntryPrice] = useState<string>("");
	const [stopLoss, setStopLoss] = useState<string>("");

	const onDrop = useCallback((acceptedFiles: File[]) => {
		acceptedFiles.forEach((file) => {
			// Check if the file is an image
			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onload = () => {
					// Convert file to base64 and store it in state
					const base64String = reader.result as string;
					setSignalImage(base64String);
				};

				reader.readAsDataURL(file);
			} else {
				console.log("File is not an image:", file.name);
			}
		});
	}, []);

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	const handleSuccessClose = () => {
		setToggleSuccess(false);
	};

	const handleModalClose = () => {
		router.back();
		setIsOpen(false);
	};

	const addTargetProfit = () => {
		// Fetch the value from the input field
		const inputElement = document.querySelector<HTMLInputElement>('input[name="targetProfit"]');
		if (inputElement && inputElement.value) {
			const newTargetProfit = inputElement.value;

			// Add the new target profit to the existing array
			if (targetProfits.length < 4) {
				setTargetProfits([...targetProfits, newTargetProfit]);
			}

			// Clear the input field after adding
			inputElement.value = "";
			inputElement.focus();
		}
	};

	function handleEntryPrice(value: string) {
		setEntryPrice(value)
	}

	function handleStopLoss(value: string) {
		setStopLoss(value)
	}

	// Validation function to check if any state value is empty
	const isSubmitDisabled = !(
		asset &&
		timeFrame &&
		signalImage &&
		targetProfits.length &&
		entryPrice &&
		stopLoss
	);

	const onReset = () => {
		setSignalImage("");
		setTargetProfits([]);
		setAsset(data.assets[0]);
		setTimeframe(data.timeFrame[0]);
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setToggleSuccess(!toggleSuccess);
	};

	return (
		<>
			<Modal
				openModal={isOpen}
				width="md:w-[807px]"
				title="Create Signal Form"
				description="System will immediately notify users after upload"
				onClose={handleModalClose}
			>
				<div>
					<form onSubmit={onSubmit} onReset={onReset} method="post">
						<div className="flex flex-col gap-y-4">
							<CustomSelect
								label="Signal Asset"
								assets={data.assets}
								selectedDefault={asset}
								onSelected={setAsset}
								selectedItemCss="bg-[#ECF2FF]"
							/>
							<CustomSelect
								label="Time frame/Candles"
								assets={data.timeFrame}
								selectedDefault={timeFrame}
								onSelected={setTimeframe}
								selectedItemCss="bg-[#ECF2FF]"
							/>
							<div>
								<InputField
									type="number"
									props={{
										disabled: targetProfits.length > 3,
										name: "targetProfit",
									}}
									labelText="Target Profits"
									placeholder="Enter target profit"
									className="no-spin-buttons"
									onKeyDown={handleKeyDown}
								/>
								<IconButton
									btnClass="text-amber-600 text-xs font-bold leading-none"
									Icon={PlusIcon}
									onClick={addTargetProfit} // Call the function to add target profit
									aria-label="add target profit"
									disabled={targetProfits.length > 3}
								>
									Add another target profit
								</IconButton>
								<div className="flex gap-4">
									{targetProfits.map((profit, index) => (
										<div
											key={index}
											className={`py-1 px-1.5 rounded border justify-center items-center gap-2 flex ${
												index === 0
													? "border-emerald-700"
													: "border-stone-300"
											}`}
										>
											<p
												className={`text-xs font-normal leading-none ${
													index === 0
														? "text-emerald-700"
														: "text-zinc-500"
												}`}
											>
												{profit}%
											</p>
										</div>
									))}
								</div>
							</div>
							<InputField
								type="number"
								labelText="Entry Price"
								props={{ name: "entryPrice" }}
								placeholder="Input trade entry price"
								onChange={handleEntryPrice}
								className="no-spin-buttons"
								onKeyDown={handleKeyDown}
							/>
							<InputField
								type="number"
								labelText="Stop loss"
								props={{ name: "stopLoss" }}
								placeholder="Input trade stop loss"
								onChange={handleStopLoss}
								className="no-spin-buttons"
								onKeyDown={handleKeyDown}
							/>
							<label className="text-slate-900 text-sm font-normal leading-none">
								Upload signal image
							</label>
							<UploadButton
								acceptedFiles={signalImage}
								getRootProps={getRootProps}
								getInputProps={getInputProps}
							/>
							<Button
								disabled={isSubmitDisabled}
								type="submit"
								className="mt-2 flex justify-center"
								innerClassName="px-[20%] py-4 capitalize"
							>
								Create Signal
							</Button>
							<Button
								type="reset"
								innerClassName="normal-case"
								className="mt-2 flex justify-center"
								color="text-blue-800"
								bgColor="bg-white"
							>
								Reset all signal
							</Button>
						</div>
					</form>
				</div>
			</Modal>

			<MessageModal
				title={"Successful"}
				description={"you have successful created  new signal"}
				icon={SuccessIcon}
				openModal={toggleSuccess}
				onClose={handleSuccessClose}
			/>
		</>
	);
}
