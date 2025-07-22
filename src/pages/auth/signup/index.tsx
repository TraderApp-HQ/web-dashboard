import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";
import VerificationModal from "~/components/AuthLayout/Modal/VerificationModal";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import InputField from "~/components/common/InputField";
import { NotificationChannel, VerificationType } from "~/apis/handlers/users/enums";
import SelectBox from "~/components/common/SelectBox";
import { UsersService } from "~/apis/handlers/users";
import { useFetch } from "~/hooks/useFetch";
import { UsersQueryId } from "~/apis/handlers/users/constants";
import type { ISelectBoxOption } from "~/components/interfaces";
import { useCreate } from "~/hooks/useCreate";
import Toast from "~/components/common/Toast";
import AuthLayout from "../layout";

const Signup = () => {
	const router = useRouter();
	const usersService = new UsersService();
	// form fields
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [emailValid, setEmailValid] = useState(false);
	const [password, setPassword] = useState("");
	const [referralCode, setReferralCode] = useState((router.query.ref as string) ?? "");
	const [passwordValid, setPasswordValid] = useState(false);
	const [country, setCountry] = useState<{ name: string; id: string }>();

	const [showVerificationModal, setShowVerificationModal] = useState(false);
	const [showHints, setShowHints] = useState(false);
	const [validCredentials, setValidCredentials] = useState(false);
	const [countryOptions, setCountryOptions] = useState<ISelectBoxOption[]>([]);
	const [passwordHints, setPasswordHints] = useState({
		uppercase: {
			value: true,
			text: "Uppercase letters",
		},
		lowercase: {
			value: false,
			text: "Lowercase letters",
		},
		special: {
			value: false,
			text: "Special characters",
		},
		numeric: {
			value: false,
			text: "Numeric characters",
		},
		eightchar: {
			value: false,
			text: "At least 8 characters long",
		},
	});
	const validatePassword = (password: string) => {
		// Password Criteria
		const minLength = 8;
		const hasLowerCase = /(?=.*[a-z])/;
		const hasUpperCase = /(?=.*[A-Z])/;
		const hasDigit = /(?=.*\d)/;
		const hasSpecialChar = /(?=.*[@#%$!%*?&_])/;

		const isValidLength = password.length >= minLength;
		const isValidLowerCase = hasLowerCase.test(password);
		const isValidUpperCase = hasUpperCase.test(password);
		const isValidDigit = hasDigit.test(password);
		const isValidSpecialChar = hasSpecialChar.test(password);

		setPasswordHints((prevHints) => ({
			...prevHints,
			uppercase: { ...prevHints.uppercase, value: isValidUpperCase },
			lowercase: { ...prevHints.lowercase, value: isValidLowerCase },
			numeric: { ...prevHints.numeric, value: isValidDigit },
			eightchar: { ...prevHints.eightchar, value: isValidLength },
			special: { ...prevHints.special, value: isValidSpecialChar },
		}));
		const isValidate =
			isValidLength &&
			isValidLowerCase &&
			isValidUpperCase &&
			isValidDigit &&
			isValidSpecialChar;
		setPasswordValid(isValidate);
	};

	const validateEmail = (email: string) => {
		// Email Criteria
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isValidEmail = emailRegex.test(email);
		setEmailValid(isValidEmail);
	};

	// handle form field changes
	const handleFirstNameChange = (value: string) => {
		setFirstName(value);
	};

	const handleLastNameChange = (value: string) => {
		setLastName(value);
	};

	const handleReferralCodeChange = (value: string) => {
		setReferralCode(value.trim());
	};

	const handleEmailChange = (value: string) => {
		validateEmail(value);
		setEmail(value);
	};

	const handlePasswordChange = (value: string) => {
		setShowHints(value.length > 0);
		validatePassword(value);
		setPassword(value);
	};

	const handleCountryChange = (option: ISelectBoxOption) => {
		setCountry({ name: option.displayText, id: option.value });
	};

	// validate form fields and set credentialsValid flag
	useEffect(() => {
		let isCredentialsValid: boolean;
		if (firstName && lastName && emailValid && passwordValid && country?.name)
			isCredentialsValid = true;
		else isCredentialsValid = false;
		setValidCredentials(isCredentialsValid);
	}, [emailValid, passwordValid, firstName, lastName, country]);

	// fetch all countries
	const {
		data: countries,
		isLoading: isCountryLoading,
		isSuccess: isCountrySuccess,
	} = useFetch({
		queryKey: [UsersQueryId.countries],
		queryFn: usersService.getAllCountries.bind(usersService),
	});

	// format countries to display on selectBox
	useEffect(() => {
		if (isCountrySuccess && countries) {
			const options: ISelectBoxOption[] = countries.map((country) => ({
				displayText: country.name,
				value: country._id.toString(),
				imgUrl: country.flag,
			}));
			setCountryOptions(options);
		}
	}, [isCountrySuccess, countries]);

	// Setup query to backend
	const {
		mutate: signupUser,
		isError,
		isPending,
		error,
		isSuccess,
		data,
	} = useCreate({
		mutationFn: usersService.signupUser.bind(usersService),
	});

	const handleSignUp = () => {
		signupUser({
			firstName,
			lastName,
			email,
			password,
			countryId: country?.id ? Number(country.id) : 89, // default to Nigeria
			countryName: country?.name ?? "Nigeria", // default to Nigeria
			...(referralCode && { referralCode }),
		});
	};

	// signup successful. Set query params and open verification modal
	useEffect(() => {
		if (isSuccess && data) {
			const newSearchParams = new URLSearchParams(router.query as Record<string, string>);

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
	}, [isSuccess, data, router.query, router.pathname]);

	return (
		<>
			<section className="h-full md:px-[20px] items-center flex justify-center max-[768px]:pt-[0px]">
				<div className="max-w-[419px] w-full">
					<header className="mb-[20px]">
						<p className="text-xl text-slate-950 font-bold" data-testid="heading">
							Let's get started
						</p>
						<span className="text-sm text-gray-500">
							Please enter your details to get started
						</span>
					</header>
					<form className="space-y-[16px]">
						{/* first name */}
						<div className="flex flex-col gap-y-[8px]">
							<InputField
								type={"text"}
								placeholder="Enter your first name"
								labelText={"First Name"}
								onChange={handleFirstNameChange}
								value={firstName}
								className="text-sm"
								labelClassName="text-slate-900 text-sm"
							/>
						</div>
						{/* last name */}
						<div className="flex flex-col gap-y-[8px]">
							<InputField
								type={"text"}
								placeholder="Enter your last name"
								labelText={"Last Name"}
								onChange={handleLastNameChange}
								value={lastName}
								className="text-sm"
								labelClassName="text-slate-900"
							/>
						</div>
						{/* email address */}
						<div className="flex flex-col gap-y-[8px]">
							<InputField
								onChange={handleEmailChange}
								value={email}
								pattern={"[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$"}
								type={"text"}
								placeholder={"Enter your email address"}
								labelText={"Email address"}
								className="text-sm"
								labelClassName="text-slate-900"
							/>
						</div>
						{/* country */}
						<div className="flex flex-col gap-y-[8px]">
							<SelectBox
								labelText="Country"
								isSearchable={true}
								options={countryOptions}
								placeholder={isCountryLoading ? "Loading..." : "Select country"}
								setOption={handleCountryChange}
								placeholderClassName="text-gray-400 text-sm"
							/>
						</div>
						{/* referral code */}
						<div className="flex flex-col gap-y-[8px]">
							<InputField
								type={"text"}
								placeholder="Enter referral code"
								labelText={"Referral Code"}
								onChange={handleReferralCodeChange}
								value={referralCode}
								className="text-sm"
								labelClassName="text-slate-900"
							/>
						</div>
						{/* password */}
						<div className="flex flex-col gap-y-[8px]">
							<InputField
								onChange={handlePasswordChange}
								type={"password"}
								placeholder="-------------"
								labelText={"Password"}
								value={password}
								className="text-sm"
								labelClassName="text-slate-900"
							/>
						</div>
						{/* password hints */}
						<Transition
							show={showHints}
							enter="transition duration-500"
							enterFrom="opacity-0 translate-x-[50%]"
							enterTo="opacity-100 translate-x-[0%]"
							leave="transition duration-150"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div>
								<p className="text-[#414141] text-[10px] mb-[8px]">
									Password must include:
								</p>
								<div className="flex flex-wrap gap-[8px] text-[10px]">
									{Object.values(passwordHints).map((hint, index) => (
										<p
											key={index}
											className={`p-[4px_6px] ${
												hint.value
													? "bg-[#EDFDF8] text-[#04724D]"
													: "bg-[#F3F5F6] text-[#848F9F]"
											} rounded-3xl`}
										>
											{hint.text}
										</p>
									))}
								</div>
							</div>
						</Transition>
						{/* action button */}
						<div className="py-[16px] space-y-[16px]">
							<button
								type="button"
								className="transition-opacity duration-300 bg-[#1836B2] rounded-2xl px-[10px] py-4 font-semibold w-full text-white disabled:opacity-60"
								onClick={handleSignUp}
								disabled={!validCredentials || isPending}
							>
								Sign up
							</button>
							<div className="text-[#08123B] text-center" onClick={() => {}}>
								Already have an account?{" "}
								<strong
									className="text-[#1836B2] font-bold cursor-pointer"
									onClick={() => {
										router.push(LAYOUT_ROUTES.auth + ROUTES.login);
									}}
								>
									Log in
								</strong>
							</div>
						</div>
					</form>
				</div>
			</section>
			<VerificationModal
				openModal={showVerificationModal}
				setOpenModal={setShowVerificationModal}
				notificationChannel={NotificationChannel.EMAIL}
				verificationType={[VerificationType.UPDATE, VerificationType.AUTHENTICATE]}
				redirectTo={LAYOUT_ROUTES.account}
			/>
			{isError && (
				<Toast
					type="error"
					variant="filled"
					title="Signup Error"
					message={error?.message ?? "Signup error"}
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
		</>
	);
};

Signup.getLayout = (page: React.ReactElement) => <AuthLayout>{page}</AuthLayout>;
export default Signup;
