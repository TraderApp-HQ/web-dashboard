import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "~/components/common/Button";
import Modal from "~/components/Modal";
import InputField from "~/components/common/InputField";
import { useCreate } from "~/hooks/useCreate";
import { UsersService } from "~/apis/handlers/users";
import Toast from "~/components/common/Toast";
import type { ISelectBoxOption } from "~/components/interfaces";
import { useFetch } from "~/hooks/useFetch";
import { UsersQueryId } from "~/apis/handlers/users/constants";
import SelectBox from "~/components/common/SelectBox";
import { UserRole } from "~/apis/handlers/users/enums";
import AdminLayout from "~/components/AdminLayout/Layout";

function CreateUser() {
	const [isOpen, setIsOpen] = useState(true);

	const router = useRouter();
	const usersService = new UsersService();
	const roleOptions: ISelectBoxOption[] = Object.values(UserRole).map((role) => ({
		displayText: role,
		value: role,
	}));

	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [role, setRole] = useState<string[]>([]);
	const [country, setCountry] = useState<{ name: string; id: string }>();
	const [countryOptions, setCountryOptions] = useState<ISelectBoxOption[]>([]);
	const [emailValid, setEmailValid] = useState(false);
	const [resetCountry, setResetCountry] = useState(false);
	const [resetRole, setResetRole] = useState(false);

	const validateEmail = (email: string) => {
		// Email Criteria
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isValidEmail = emailRegex.test(email);
		setEmailValid(isValidEmail);
	};

	const handleFirstNameChange = (value: string) => {
		setFirstName(value);
	};

	const handleLastNameChange = (value: string) => {
		setLastName(value);
	};

	const handleEmailChange = (value: string) => {
		validateEmail(value);
		setEmail(value);
	};

	const handleRoleChange = (role: ISelectBoxOption) => {
		setResetRole(false);
		setRole((prevRoles) => {
			if (prevRoles.includes(role.value)) {
				return prevRoles.filter((r) => r !== role.value);
			} else {
				return [...prevRoles, role.value];
			}
		});
	};

	const handleCountryChange = (option: ISelectBoxOption) => {
		setResetCountry(false);
		setCountry({ name: option.displayText, id: option.value });
	};

	const handleModalClose = () => {
		router.push(".");
		setIsOpen(false);
	};
	// Validation function to check if any state value is empty
	const isSubmitDisabled = !(firstName && lastName && emailValid && role.length && country);

	const onReset = () => {
		setFirstName("");
		setLastName("");
		setEmail("");
		setResetCountry(true);
		setResetRole(true);
	};

	// Setup query to backend
	const {
		mutate: createNewUser,
		isError,
		isPending,
		error,
		isSuccess,
		data,
	} = useCreate({
		mutationFn: usersService.createNewUser.bind(usersService),
	});

	// Make call to backend
	const handleCreateUser = () => {
		createNewUser({
			firstName,
			lastName,
			email,
			role: role as UserRole[],
			countryId: Number(country?.id),
			countryName: country?.name,
		});
	};

	const onSubmit = () => {
		// event.preventDefault();
		handleCreateUser();
	};

	// user creation successful. Display success toast
	useEffect(() => {
		if (isSuccess && data) {
			setIsOpen(false);
			router.push("/admin/user-management");
		}
	}, [isSuccess, data]);

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

	return (
		<>
			<Modal
				openModal={isOpen}
				width="md:w-[807px]"
				title="Create User Form"
				description="System will immediately notify after user creation"
				onClose={handleModalClose}
			>
				<div>
					<div className="flex flex-col gap-y-4">
						<InputField
							type="text"
							labelText="First Name"
							props={{ name: "firstname" }}
							placeholder="Enter First Name"
							onChange={handleFirstNameChange}
							className="no-spin-buttons"
							value={firstName}
						/>
						<InputField
							type="text"
							labelText="Last Name"
							props={{ name: "lastname" }}
							placeholder="Enter Last Name"
							onChange={handleLastNameChange}
							className="no-spin-buttons"
							value={lastName}
						/>
						<InputField
							type="text"
							labelText="Email"
							props={{ name: "email" }}
							placeholder="Enter Email"
							pattern={"[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$"}
							onChange={handleEmailChange}
							value={email}
							className="no-spin-buttons"
						/>
						<div className="flex flex-col gap-y-[8px]">
							<SelectBox
								labelText="Country"
								isSearchable={true}
								options={countryOptions}
								placeholder={isCountryLoading ? "Loading..." : "Select country"}
								setOption={handleCountryChange}
								clear={resetCountry}
							/>
						</div>
						<div className="flex flex-col gap-y-[8px]">
							<SelectBox
								labelText="User Role(s)"
								options={roleOptions}
								placeholder="Select role"
								setOption={handleRoleChange}
								clear={resetRole}
							/>
						</div>
						<Button
							disabled={isSubmitDisabled}
							className="mt-2 flex justify-center"
							isProcessing={isPending}
							labelText="Create User"
							onClick={onSubmit}
						/>
						<Button
							className="mt-2 flex justify-center !text-blue-800 bg-white border"
							labelText="Reset all inputs"
							onClick={onReset}
						/>
					</div>
				</div>

				{isError && (
					<Toast
						type="error"
						variant="filled"
						title="User Creation Error"
						message={error?.message ?? "Something went wrong!"}
						autoVanish
						autoVanishTimeout={10}
					/>
				)}
				{data && (
					<Toast
						type="info"
						variant="filled"
						title="User successfully created"
						message="Successful!"
						autoVanish
						autoVanishTimeout={10}
					/>
				)}
			</Modal>
		</>
	);
}

CreateUser.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default CreateUser;
