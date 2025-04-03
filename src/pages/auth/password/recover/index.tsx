import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { UsersService } from "~/apis/handlers/users";
import Button from "~/components/common/Button";
import InputField from "~/components/common/InputField";
import Toast from "~/components/common/Toast";
import { LAYOUT_ROUTES, ROUTES, EmailValidation } from "~/config/constants";
import { useCreate } from "~/hooks/useCreate";
import AuthLayout from "../../layout";
import ArrowLeft from "~/components/common/ArrowLeft";

const RecoverPassword = () => {
	const router = useRouter();
	const usersService = new UsersService();

	const [email, setEmail] = useState("");
	const [emailValid, setEmailValid] = useState(false);

	const handleEmailChange = (value: string) => {
		setEmail(value);
		const emailRegex = EmailValidation;
		const isValidEmail = emailRegex.test(value);
		setEmailValid(isValidEmail);
	};

	// Setup query to backend
	const {
		mutate: sendResetPasswordLink,
		isError,
		isPending,
		error,
		isSuccess,
		data,
	} = useCreate({
		mutationFn: usersService.sendPasswordResetLink.bind(usersService),
	});

	const handleSubmit = () => {
		sendResetPasswordLink(email);
	};

	useEffect(() => {
		if (isSuccess) {
			setEmail("");
			setTimeout(() => {
				router.push("/auth/login");
			}, 10000);
		}
	}, [isSuccess]);

	return (
		<>
			<section className="py-[100px] h-full md:px-[20px] flex items-center max-[768px]:justify-center max-[768px]:pt-[0px]">
				<div className="max-w-[419px] w-full">
					<header className="flex flex-col items-center mb-[40px]">
						<Image
							src="/images/auth/padlock.png"
							width={73}
							height={73}
							alt="padlock"
							className="mb-[12px]"
						/>
						<p className="text-[32px] text-[#102477] font-extrabold">Forgot Password</p>
						<div className="flex items-center justify-center gap-x-[13px]">
							<p className="font-bold text-[#B25E09]">
								No worries, we will send you reset instructions.
							</p>
						</div>
					</header>
					<form className="space-y-[16px]">
						{/* email address */}
						<div className="flex flex-col gap-y-[8px]">
							<InputField
								value={email}
								onChange={handleEmailChange}
								type={"text"}
								placeholder={"Enter your email address"}
								labelText={"Email address"}
							/>
						</div>
						{/* action button */}
						<div className="py-[16px] space-y-[16px]">
							<Button
								labelText="Continue"
								className="w-full"
								onClick={handleSubmit}
								disabled={!emailValid || isPending}
								isProcessing={isPending}
							/>
							<div
								className="text-[#08123B] flex justify-center items-center gap-x-[11px] cursor-pointer"
								onClick={() => router.push(LAYOUT_ROUTES.auth + ROUTES.login)}
							>
								{/* <img src="/icons/arrow-left.svg" alt="arrow-left" width={24} /> */}
								<ArrowLeft />
								Back to Login
							</div>
						</div>
					</form>
				</div>
			</section>
			{isError && (
				<Toast
					type="error"
					variant="filled"
					title={error?.name ?? "Password Reset Error"}
					message={error?.message ?? "Something went wrong resetting your password"}
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
			{isSuccess && (
				<Toast
					type="success"
					variant="filled"
					title={"Password Reset Link."}
					message={data ?? "Password reset link sent successfully!"}
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
		</>
	);
};

RecoverPassword.getLayout = (page: React.ReactElement) => <AuthLayout>{page}</AuthLayout>;
export default RecoverPassword;
