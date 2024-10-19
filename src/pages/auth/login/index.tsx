import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InputField from "~/components/common/InputField";
import { UsersService } from "~/apis/handlers/users";
import { useCreate } from "~/hooks/useCreate";
import { LAYOUT_ROUTES, ROUTES, EmailValidation } from "~/config/constants";
import VerificationModal from "~/components/AuthLayout/Modal/VerificationModal";
import { NotificationChannel, VerificationType } from "~/apis/handlers/users/enums";
import Toast from "~/components/common/Toast";
import AuthLayout from "../layout";
import { useSearchParams } from "next/navigation";
import useUnProtectedRoute from "~/hooks/useUnProtectedRoute";

const Login = () => {
	const router = useRouter();
	useUnProtectedRoute({ path: router.pathname });
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordValid, setPasswordValid] = useState(false);
	const [emailValid, setEmailValid] = useState(false);
	const [validCredential, setValidCredential] = useState(false);
	const [showVerificationModal, setShowVerificationModal] = useState(false);
	const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
	const [isQueryParamsSet, setIsQueryParamsSet] = useState(false);
	const redirectTo = useSearchParams().get("redirect_to");

	// const [searchParams, setSearchParams] = useState(new URLSearchParams(router.asPath.split('?')[1]));
	const usersService = new UsersService();

	const validateEmail = (email: string) => {
		const emailRegex = EmailValidation;
		const isValidEmail = emailRegex.test(email);
		setEmailValid(isValidEmail);
	};

	const validatePassword = (password: string) => {
		const minLength = 1;
		const isValidLength = password.length >= minLength;
		setPasswordValid(isValidLength);
	};

	const handlePasswordChange = (value: string) => {
		setPassword(value);
		validatePassword(value);
	};

	const handleEmailChange = (value: string) => {
		setEmail(value);
		validateEmail(value);
	};

	useEffect(() => {
		const validCredential = emailValid && passwordValid;
		setValidCredential(validCredential);
	}, [emailValid, passwordValid]);

	// Setup query to backend
	const {
		mutate: loginUser,
		isError,
		isPending,
		error,
		isSuccess,
		data,
	} = useCreate({
		mutationFn: usersService.loginUser.bind(usersService),
	});

	// Make call to backend
	const handleLogin = () => {
		loginUser({ email, password });
	};

	// login successful. Set query params and open verification modal
	useEffect(() => {
		if (isSuccess && data) {
			const newSearchParams = new URLSearchParams();

			Object.entries(router.query).forEach(([key, value]) => {
				if (Array.isArray(value)) {
					newSearchParams.set(key, value.join(","));
				} else if (value !== undefined) {
					newSearchParams.set(key, value);
				}
			});

			newSearchParams.set("userid", data.id);
			newSearchParams.set("recipient", data.email);

			router.replace(
				{
					pathname: router.pathname,
					query: Object.fromEntries(newSearchParams.entries()),
				},
				undefined,
				{ shallow: true },
			);

			setShowVerificationModal(true);
		}
	}, [isSuccess, data, router]);

	// ensure query params are set
	useEffect(() => {
		if (router.query.userid && router.query.recipient) {
			setIsQueryParamsSet(true);
		}
	}, [router.query]);

	const handleVerificationSuccess = async () => {
		setIsVerificationSuccess(true);
	};

	return (
		<section className="py-[100px] h-full md:px-[20px] flex items-center max-[768px]:justify-center max-[768px]:pt-[0px]">
			<div className="max-w-[419px] w-full">
				<header className="text-center mb-[40px]">
					<p className="text-[32px] text-[#102477] font-extrabold">Welcome back!</p>
					<div className="flex items-center justify-center gap-x-[13px]">
						<p className="font-bold text-[#B25E09]">
							Enter your details to login to your account.
						</p>
					</div>
				</header>
				<form className="space-y-[16px]" noValidate>
					{/* email address */}
					<div className="flex flex-col gap-y-[8px]">
						<InputField
							value={email}
							onChange={handleEmailChange}
							pattern={"[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$"}
							type="text"
							placeholder={"Enter your email address"}
							labelText={"Email address"}
						/>
					</div>
					{/* password */}
					<div className="flex flex-col gap-y-[8px]">
						<InputField
							value={password}
							onChange={handlePasswordChange}
							type={"password"}
							placeholder="-------------"
							labelText={"Password"}
						/>
					</div>
					{/* forgot password */}
					<div>
						<p
							className="text-[#102477] dura text-[14px] font-sembold cursor-pointer"
							onClick={() => {
								router.push(LAYOUT_ROUTES.auth + ROUTES.passwordrecover);
							}}
						>
							Forgot Password
						</p>
					</div>
					{/* action button */}
					<div className="p-[16px] space-y-[16px]">
						<button
							type="button"
							className="transition-opacity duration-300 bg-[#1836B2] rounded-2xl p-[10px] font-semibold w-full text-white disabled:opacity-60"
							onClick={handleLogin}
							disabled={!validCredential || isPending}
						>
							{isPending ? "Please wait..." : "Login"}
						</button>
						<div
							className="text-[#08123B] text-center cursor-pointer"
							onClick={() => {
								router.push(LAYOUT_ROUTES.auth + ROUTES.signup);
							}}
						>
							Don't have an account?{" "}
							<strong className="text-[#1836B2] font-bold">Sign up</strong>
						</div>
					</div>
				</form>
			</div>
			{isQueryParamsSet && (
				<VerificationModal
					openModal={showVerificationModal}
					setOpenModal={() => setShowVerificationModal(true)}
					isSuccess={isVerificationSuccess}
					setIsSuccess={handleVerificationSuccess}
					notificationChannel={NotificationChannel.EMAIL}
					verificationType={[VerificationType.AUTHENTICATE]}
					redirectTo={redirectTo ?? LAYOUT_ROUTES.account}
				/>
			)}
			{isError && (
				<Toast
					type="error"
					variant="filled"
					title="Login Error"
					message={error?.message ?? "Login error"}
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
		</section>
	);
};

Login.getLayout = (page: React.ReactElement) => <AuthLayout>{page}</AuthLayout>;
export default Login;
