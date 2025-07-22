import { useRouter } from "next/router";
import { useEffect, useState, useRef, ClipboardEvent } from "react";
import { UsersService } from "~/apis/handlers/users";
import { NotificationChannel, VerificationType } from "~/apis/handlers/users/enums";
import { useCreate } from "~/hooks/useCreate";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import Toast from "~/components/common/Toast";
import AuthLayout from "../layout";
import ArrowLeft from "~/components/common/ArrowLeft";

const OTPCountDownTime = 90;

const OtpPage = () => {
	const router = useRouter();
	const { userid, recipient } = router.query;

	if ((!userid || !recipient) && typeof window !== "undefined") {
		router.replace(LAYOUT_ROUTES.auth + ROUTES.login);
	}

	const usersService = new UsersService();

	const [enteredInput, setEnteredInput] = useState(["", "", "", "", "", ""]);
	const [countdown, setCountdown] = useState(OTPCountDownTime);
	const [otpError, setOtpError] = useState<Error | null>(null);
	const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

	useEffect(() => {
		if (!userid || !recipient) {
			router.replace(LAYOUT_ROUTES.auth + ROUTES.login);
		}
	}, [userid, recipient, router]);

	const {
		mutate: verifyOtp,
		isError: isVerificationErrorFlag,
		isPending,
		isSuccess: isVerificationSuccess,
		error: verifyOtpError,
	} = useCreate({
		mutationFn: usersService.verifyOtp.bind(usersService),
	});

	const {
		mutate: sendOtp,
		error: sendOtpError,
		isError: isSendOtpErrorFlag,
	} = useCreate({
		mutationFn: usersService.sendOtp.bind(usersService),
	});

	// Handle error states
	useEffect(() => {
		setOtpError(isVerificationErrorFlag ? verifyOtpError : null);
	}, [isVerificationErrorFlag]);

	useEffect(() => {
		setOtpError(isSendOtpErrorFlag ? sendOtpError : null);
	}, [isSendOtpErrorFlag]);

	// Countdown timer
	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (countdown > 0) {
			timer = setInterval(() => {
				setCountdown((prev) => prev - 1);
			}, 1000);
		}
		return () => clearInterval(timer);
	}, [countdown]);

	useEffect(() => {
		if (isVerificationSuccess) {
			router.push(LAYOUT_ROUTES.account);
		}
	}, [isVerificationSuccess, router]);

	useEffect(() => {
		if (inputRefs.current[0]) {
			inputRefs.current[0].focus();
		}
	}, []);

	const inputChangeHandler = (index: number, value: string) => {
		value = value.trim();

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

	// Handle backspace key press
	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (
			e.key === "Backspace" &&
			!enteredInput[index] &&
			index > 0 &&
			inputRefs.current[index - 1]
		) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	// Handle paste
	const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
		const pasteData = e.clipboardData
			.getData("text")
			.slice(0, 6)
			.split("")
			.filter((char) => /\d/.test(char));

		const newOtp =
			pasteData.length < 6
				? pasteData.concat(new Array(6 - pasteData.length).fill(""))
				: pasteData;

		newOtp.forEach((value, index) => {
			if (value && index < inputRefs.current.length) {
				inputRefs.current[index]!.value = value;
				inputRefs.current[index]!.focus();
			}
		});

		setEnteredInput(newOtp);
	};

	const handleVerification = async () => {
		const enteredOTP = enteredInput.join("");
		verifyOtp({
			userId: userid as string,
			verificationType: [VerificationType.AUTHENTICATE],
			data: [
				{
					otp: enteredOTP,
					channel: NotificationChannel.EMAIL,
				},
			],
		});
	};

	// Resend OTP
	const resendOtp = () => {
		sendOtp({ userId: userid as string });
		setCountdown(OTPCountDownTime);
		setEnteredInput(["", "", "", "", "", ""]);
		if (inputRefs.current[0]) {
			inputRefs.current[0].focus();
		}
	};

	const isInputsEmpty = enteredInput.some((value) => value === "");

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<section className="min-h-screen flex flex-col md:justify-center max-w-[393px] mx-auto py-6 bg-[#E5E9F8]">
			<div className="flex items-center gap-3 mb-4 md:hidden">
				<button onClick={() => router.back()} className="p-2 -ml-2">
					<ArrowLeft />
				</button>
			</div>

			<div className="flex-1 flex flex-col md:flex-none">
				<div className="mb-8">
					<h1 className="text-black text-base font-medium mb-4">OTP Verification</h1>
					<p className="text-[#6A6389] text-sm leading-5">
						A verification code has been sent to your phone number. Please enter the
						code below.
					</p>
				</div>

				<div className="mb-12">
					<label htmlFor="otp-input-0" className="text-[#353244] text-sm block mb-4">
						OTP code
					</label>

					<div className="flex items-center gap-3 mb-8">
						{enteredInput.map((value, index) => (
							<div key={index} className="relative">
								<input
									id={index === 0 ? "otp-input-0" : undefined}
									ref={(el) => {
										inputRefs.current[index] = el;
									}}
									type="text"
									maxLength={1}
									value={value}
									onChange={(e) => inputChangeHandler(index, e.target.value)}
									onKeyDown={(e) => handleKeyDown(index, e)}
									onPaste={index === 0 ? handlePaste : undefined}
									className="w-5 h-12 text-center text-black border-b border-black bg-transparent focus:outline-none focus:border-[#1836B2] text-lg font-medium"
								/>
							</div>
						))}
					</div>

					<p className="text-[#0C081F] text-sm">
						Didn't receive your code?{" "}
						{countdown > 0 ? (
							<span>Retry in {formatTime(countdown)}</span>
						) : (
							<button onClick={resendOtp} className="text-[#1836B2] font-medium">
								Resend code
							</button>
						)}
					</p>
				</div>

				<div className="mb-4">
					<button
						onClick={handleVerification}
						disabled={isInputsEmpty || isPending}
						className="w-full bg-[#1836B2] text-white font-semibold py-4 px-4 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{isPending ? "Verifying..." : "Continue"}
					</button>
				</div>
			</div>

			<div className="flex justify-center -mb-3 md:hidden">
				<div className="w-32 h-1 bg-black rounded-full opacity-60"></div>
			</div>

			{otpError && (
				<Toast
					type="error"
					variant="filled"
					title="OTP Error"
					message={otpError.message ?? "Invalid OTP"}
					autoVanish
					autoVanishTimeout={5}
				/>
			)}
		</section>
	);
};

OtpPage.getLayout = (page: React.ReactElement) => <AuthLayout>{page}</AuthLayout>;
export default OtpPage;
