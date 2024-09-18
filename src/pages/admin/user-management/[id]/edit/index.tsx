import { useCallback, useEffect, useState } from "react";
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
import { useRouter } from "next/router";
import AdminLayout from "~/components/AdminLayout/Layout";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.params!;
	return {
		props: {
			id,
		},
	};
};

function UpdateUser({ id }: { id: string }) {
	const [isOpen, setIsOpen] = useState(true);
	const router = useRouter();
	const usersService = new UsersService();

	const fetchUser = useCallback(() => usersService.getUser({ id }), [id, usersService]);
	const { data: fetchData, isSuccess: fetchSuccess } = useFetch({
		queryKey: [id],
		queryFn: fetchUser,
	});
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
	const [currentRole, setCurrentRole] = useState<ISelectBoxOption>();
	const [currentCountry, setCurrentCountry] = useState<ISelectBoxOption>();

	const handleFirstNameChange = (value: string) => {
		setFirstName(value);
	};

	const handleLastNameChange = (value: string) => {
		setLastName(value);
	};

	const handleEmailChange = (value: string) => {
		setEmail(value);
	};

	const handleRoleChange = (role: ISelectBoxOption) => {
		setRole((prevRoles) => {
			if (prevRoles.includes(role.value)) {
				return prevRoles.filter((r) => r !== role.value);
			} else {
				return [...prevRoles, role.value];
			}
		});
	};

	const handleCountryChange = (option: ISelectBoxOption) => {
		setCountry({ name: option.displayText, id: option.value });
	};

	const handleModalClose = () => {
		setIsOpen(false);
		router.back();
	};
	// Validation function to check if any state value is empty
	const isSubmitDisabled = !(firstName && lastName && email && role.length && country);

	// Optionally update state when fetchData changes
	useEffect(() => {
		if (fetchSuccess && fetchData) {
			setFirstName(fetchData.firstName);
			setLastName(fetchData.lastName);
			setEmail(fetchData.email);
			const currentRole: ISelectBoxOption | undefined = roleOptions.find(
				(role) => role.value === fetchData?.role[0],
			);
			if (currentRole) {
				setCurrentRole(currentRole);
				setRole(fetchData.role);
			}
			if (countryOptions) {
				const currentCountry = countryOptions.find(
					(item) => parseInt(item.value, 10) === fetchData?.countryId,
				);
				setCurrentCountry(currentCountry);
			}
		}
	}, [fetchSuccess, fetchData]);

	// Setup query to backend
	const {
		mutate: updateUser,
		isError,
		isPending,
		error,
		isSuccess,
		data,
	} = useCreate({
		mutationFn: usersService.updateUser.bind(usersService),
	});

	useEffect(() => {
		isSuccess && router.push(`/admin/user-management/${id}/details`);
	}, [isSuccess]);

	// Make call to backend
	const handleUpdateUser = () => {
		updateUser({
			id,
			firstName,
			lastName,
			role: role as UserRole[],
			countryId: Number(country?.id),
			countryName: country?.name,
		});
	};

	const onSubmit = () => {
		// event.preventDefault();
		handleUpdateUser();
	};

	// user update successful. Display success toast
	useEffect(() => {
		if (isSuccess && data) {
			setTimeout(() => {
				setIsOpen(false);
			}, 8000);
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

	useEffect(() => {
		const currentCountry = countryOptions.find(
			(item) => parseInt(item.value, 10) === fetchData?.countryId,
		);
		setCurrentCountry(currentCountry);
	}, [countryOptions]);

	return (
		<>
			<Modal
				openModal={isOpen}
				width=""
				title="Edit User"
				description=""
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
							onChange={handleEmailChange}
							className="no-spin-buttons"
							value={email}
						/>
						<div className="flex flex-col gap-y-[8px]">
							<SelectBox
								labelText="Country"
								isSearchable={true}
								options={countryOptions}
								option={currentCountry}
								placeholder={isCountryLoading ? "Loading..." : "Select country"}
								setOption={handleCountryChange}
							/>
						</div>
						<div className="flex flex-col gap-y-[8px]">
							<SelectBox
								labelText="User Role(s)"
								options={roleOptions}
								option={currentRole}
								placeholder="Select role"
								setOption={handleRoleChange}
							/>
						</div>
						<Button
							className="mt-2 flex justify-center"
							isProcessing={isPending}
							labelText="Save"
							onClick={onSubmit}
							disabled={isSubmitDisabled}
						/>
					</div>
				</div>

				{isError && (
					<Toast
						type="error"
						variant="filled"
						title="User Update Error"
						message={error?.message ?? "Something went wrong!"}
						autoVanish
						autoVanishTimeout={10}
					/>
				)}
				{data && (
					<Toast
						type="info"
						variant="filled"
						title="User successfully updated"
						message="Successful!"
						autoVanish
						autoVanishTimeout={10}
					/>
				)}
			</Modal>
		</>
	);
}

UpdateUser.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default UpdateUser;
