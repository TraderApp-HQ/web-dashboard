/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, ClipboardEvent } from "react";
import { useRouter } from "next/router";
import Modal from ".";
import type { NotificationChannel, VerificationType } from "~/apis/handlers/users/enums";
import { UsersService } from "~/apis/handlers/users";
import { useCreate } from "~/hooks/useCreate";
import Image from "next/image";

interface IVerificationModal {
	openModal: boolean;
	setOpenModal: (value: boolean) => void;
	isSuccess?: boolean;
	setIsSuccess?: (value: boolean) => void;
	notificationChannel: NotificationChannel;
	verificationType: VerificationType[];
	redirectTo?: string;
}

const initialCountdownTime = 90; // 90 seconds

export default function VerificationModal({
	openModal,
	setOpenModal,
	// isSuccess,
	setIsSuccess,
	redirectTo,
	notificationChannel,
	verificationType,
}: IVerificationModal) {
	const router = useRouter();
	/* Initialize enteredInput state as an array of strings */
	const [enteredInput, setEnteredInput] = useState(["", "", "", "", "", ""]);
	const [countdown, setCountdown] = useState(initialCountdownTime);
	const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
	const [searchParams] = useState(new URLSearchParams(router.asPath.split("?")[1]));
	const [isVerificationError, setIsVerificationError] = useState<boolean>(false);

	const usersService = new UsersService();
	const userId = searchParams.get("userid");
	const recipient = searchParams.get("recipient");

	/* Handle input change */
	const inputChangeHandler = (index: number, value: string) => {
		value = value.trim();
		// Remove error message when input changes
		if (setIsSuccess) setIsSuccess(false);

		// Check if the value is a number
		if (!isNaN(Number(value))) {
			const newInput = [...enteredInput];
			newInput[index] = value;
			setEnteredInput(newInput);
		}
		// Move to next input if current field is filled
		if (value !== "" && index < inputRefs.current.length - 1 && !isNaN(Number(value))) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	// Handle pasting of OTP
	const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
		// Get the pasted data (max 6 characters) and ensure only digits are taken
		const pasteData = e.clipboardData
			.getData("text")
			.slice(0, 6)
			.split("")
			.filter((char) => /\d/.test(char));

		// Ensure otp digit is not less than 6
		const newOtp =
			pasteData.length < 6
				? pasteData.concat(new Array(6 - pasteData.length).fill(""))
				: pasteData;

		newOtp.forEach((value, index) => {
			if (value && index < inputRefs.current.length) {
				inputRefs.current[index]!.value = value; // Set value of the respective input field
				inputRefs.current[index]!.focus(); // Focus the input to next field
			}
		});

		setEnteredInput(newOtp);
	};

	// Handle Backspace key press
	const handleKeyDown = (index: number, e: any) => {
		if (
			e.key === "Backspace" &&
			!enteredInput[index] &&
			index > 0 &&
			inputRefs.current[index - 1]
		) {
			// Move focus to the previous input field on backspace
			inputRefs.current[index - 1]?.focus();
		}
	};

	const focusFirstInputField = () => {
		if (inputRefs.current[0]) {
			inputRefs.current[0].focus();
		}
	};

	/* Check input if some have an empty string as a value */
	const isInputsEmpty = enteredInput.some((value) => value === "");

	useEffect(() => {
		// Initialize inputRefs
		inputRefs.current = inputRefs.current.slice(0, enteredInput.length);
	}, [enteredInput.length]);

	useEffect(() => {
		setCountdown(initialCountdownTime);
	}, [openModal]);

	// check if otp is set on first load then open otp modal. This is typically used on page reload
	useEffect(() => {
		if (userId && recipient) {
			setOpenModal(true);
		}
	}, []);

	useEffect(() => {
		focusFirstInputField();
	}, [inputRefs.current[0]]);

	const resendOtp = () => {
		sendOtp({ userId: userId! });
		setCountdown(initialCountdownTime);
		setEnteredInput(["", "", "", "", "", ""]);
		focusFirstInputField();
	};

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (countdown > 0) {
			timer = setInterval(() => {
				setCountdown((prev) => prev - 1);
			}, 1000);
		}

		return () => clearInterval(timer);
	}, [countdown]);

	const {
		mutate: verifyOtp,
		isError: isVerificationErrorFlag,
		isPending,
		isSuccess: isVerificationSuccess,
	} = useCreate({
		mutationFn: usersService.verifyOtp.bind(usersService),
	});

	const { mutate: sendOtp } = useCreate({
		mutationFn: usersService.sendOtp.bind(usersService),
	});

	const handleVerification = async () => {
		// verify otp
		const enteredOTP = enteredInput.join("");
		verifyOtp({
			userId: userId!,
			verificationType,
			data: [
				{
					otp: enteredOTP,
					channel: notificationChannel,
				},
			],
		});
	};

	useEffect(() => {
		const handleRedirect = async () => {
			if (isVerificationSuccess && redirectTo) {
				await router.push(redirectTo);
				setOpenModal(false);
				if (setIsSuccess) setIsSuccess(true);
			}
		};

		handleRedirect();
	}, [isVerificationSuccess, redirectTo, router, setOpenModal, setIsSuccess]);

	useEffect(() => {
		if (isVerificationErrorFlag) {
			setIsVerificationError(true);
			setTimeout(() => {
				setIsVerificationError(false);
			}, 10000);
		}
	}, [isVerificationErrorFlag]);

	return (
		<Modal open={openModal} setOpen={setOpenModal} data-testId="otp-modal">
			<section>
				<div>
					<header className="flex flex-col items-center mb-[40px]">
						<Image
							src="/images/auth/pen.png"
							width={73}
							height={73}
							alt="pen"
							className="mb-[12px] w-[73px] h-[73px]"
						/>
						<p className="text-[32px] text-[#102477] font-extrabold">
							OTP verification
						</p>
						<div className="flex items-center justify-center gap-x-[13px]">
							<p className="font-bold text-[#08123B]">
								We sent a 6 digit OTP to {recipient}
							</p>
						</div>
					</header>
					<div>
						<p className="text-center text-[#01171F] font-bold">OTP</p>
					</div>
					<form className="space-y-[16px]">
						{/* pin */}
						<div className="flex justify-center gap-[8px]">
							{enteredInput.map((value, index) => (
								<input
									key={index}
									type="text"
									placeholder=""
									max={1}
									maxLength={1}
									value={value}
									ref={(ref) => {
										inputRefs.current[index] = ref;
									}}
									onChange={(e) => inputChangeHandler(index, e.target.value)}
									onPaste={handlePaste}
									onKeyDown={(e) => handleKeyDown(index, e)}
									className="placeholder-[#808080] w-[54px] h-[54px] text-[#102477] bg-[#F5F8FE] rounded-lg font-normal p-[20px] outline-[1px] outline-[#6579CC]"
								/>
							))}
						</div>
						{/* action button */}
						<div className="p-[16px] space-y-[16px] flex flex-col items-center">
							<button
								type="button"
								className="max-w-[364px] rounded-2xl p-[10px] font-semibold w-full text-white"
								style={
									isInputsEmpty || isPending
										? { background: "#BFD3E0" }
										: { background: "#1836B2" }
								}
								onClick={handleVerification}
								disabled={isInputsEmpty || isPending}
							>
								Confirm
							</button>
							{isVerificationError && (
								<p className="text-[red] flex justify-center">
									Otp could not be verfied
								</p>
							)}
							<div style={{ display: "flex" }}>
								<div className="text-[#08123B] text-center">
									Didn’t receive your code?{" "}
									<strong
										className={`text-[#102477] font-bold ${countdown === 0 && "cursor-pointer"}`}
										onClick={() => countdown === 0 && resendOtp()}
									>
										{countdown !== 0 ? "Retry in" : "Resend code."}
									</strong>
								</div>
								<div>
									{openModal && countdown !== 0 && (
										<p className="text-[#102477] font-bold ml-2">
											{Math.floor(countdown / 60)}:
											{String(countdown % 60).padStart(2, "0")}
										</p>
									)}
								</div>
							</div>
						</div>
					</form>
				</div>
			</section>
		</Modal>
	);
}
