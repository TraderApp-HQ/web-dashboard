import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { UsersService } from "~/apis/handlers/users";
import type { IUserProfile } from "~/apis/handlers/users/interfaces";
import Button from "~/components/AccountLayout/Button";
import Card from "~/components/AccountLayout/Card";
import UserTile from "~/components/AccountLayout/UserTile";
import Modal from "~/components/Modal";
import TickIcon from "~/components/icons/TickIcon";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import { renderStatus } from "~/helpers";
import { useFetch } from "~/hooks/useFetch";
import { formattedDate } from "~/lib/utils";
import ConfirmModal from "../../../../../components/AdminLayout/User/ConfirmModal";
import { UserStatus } from "~/config/enum";
import AdminLayout from "~/components/AdminLayout/Layout";
import { useCreate } from "~/hooks/useCreate";
import Toast from "~/components/common/Toast";
import { UserRole } from "~/apis/handlers/users/enums";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.params!;
	return {
		props: {
			id,
		},
	};
};

const UserDetails = ({ id }: { id: string }) => {
	const router = useRouter();
	const [openModal] = useState(true);
	const [showFundButton, setShowFundButton] = useState(false);
	const usersService = new UsersService();

	const fetchUser = useCallback(() => usersService.getUser({ id }), [id, usersService]);
	const { data, error, isLoading, isSuccess, isError, refetch } = useFetch({
		queryKey: [id],
		queryFn: fetchUser,
	});

	// Check if user is admin or super admin and if in development environment
	useEffect(() => {
		if (
			process.env.NODE_ENV === "development" &&
			(data?.role.includes(UserRole.SUPER_ADMIN) || data?.role.includes(UserRole.ADMIN))
		) {
			setShowFundButton(true);
		}
	}, [data]);

	const {
		mutate: trackUserReferrals,
		isError: isReferralTrackError,
		error: referralTrackError,
		isSuccess: isReferralTrackSuccess,
		isPending: isReferralTrackPending,
	} = useCreate({
		mutationFn: usersService.trackUserReferrals.bind(usersService),
	});

	const onClose = () => {
		router.push(`${LAYOUT_ROUTES.admin}${ROUTES.usermanagement.homepage}`);
	};

	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

	const handleDeactivateClick = () => {
		setIsConfirmModalOpen(true);
	};

	const handleConfirmModalClose = () => {
		setIsConfirmModalOpen(false);
		refetch();
	};

	return (
		<Modal openModal={openModal} width="md:w-[807px]" onClose={onClose}>
			{isError && <div className="text-red-400">{error.message}</div>}
			{isLoading && <div>Loading.....</div>}
			{isSuccess && (
				<div className="flex flex-col items-center gap-y-6 mb-6">
					<UserTile
						bgColor="bg-blue-100"
						textColor="text-blue-800"
						size={{ width: "!w-[76px]", height: "!h-[77px]" }}
						firstName={data?.firstName}
						lastName={data?.lastName}
					/>
					<h3>{`${data?.firstName ?? "First Name"} ${data?.lastName ?? "Last Name"}`}</h3>
					<div className="flex gap-4 justify-center items-center flex-wrap">
						<Button
							onClick={() => router.push(`/admin/user-management/${data?.id}/edit`)}
							size="small"
						>
							Edit user details
						</Button>
						<Button
							bgColor="bg-white"
							color="text-black"
							innerClassName="!border-neutral-300"
							onClick={handleDeactivateClick}
							size="small"
						>
							{data.status === UserStatus.ACTIVE
								? "Deactivate User"
								: "Reactivate User"}
						</Button>
						<Button
							bgColor="bg-white"
							color="text-black"
							innerClassName="!border-neutral-300"
							onClick={() => trackUserReferrals({ userId: data.id })}
							disabled={isReferralTrackPending}
							size="small"
						>
							Track Referrals
						</Button>
						{showFundButton && (
							<Button
								bgColor="bg-white hover:bg-blue-100 hover:transition-colors"
								color="text-black"
								innerClassName="!border-neutral-300"
								onClick={() =>
									router.push(`/admin/user-management/${data?.id}/add-fund`)
								}
								size="small"
							>
								Add Fund
							</Button>
						)}
					</div>

					<ConfirmModal
						user={data}
						isOpen={isConfirmModalOpen}
						onClose={handleConfirmModalClose}
					/>
					<UserRecord user={data} />
					<UserRecordList user={data} />
				</div>
			)}
			{isReferralTrackError && (
				<Toast
					type="error"
					variant="filled"
					title="Referral Tracking Error"
					message={referralTrackError?.message ?? "Something went wrong!"}
					autoVanish
					autoVanishTimeout={3}
				/>
			)}
			{isReferralTrackSuccess && (
				<Toast
					type="info"
					variant="filled"
					title="Referrals Tracked Successfully"
					message="Successful!"
					autoVanish
					autoVanishTimeout={3}
				/>
			)}
		</Modal>
	);
};

interface UserInfoItemProps {
	label: string;
	value?: string;
	verify?: boolean;
}
interface IUserRecordProps {
	user?: IUserProfile;
}

// Component to display individual user information item
const UserInfoItem: React.FC<UserInfoItemProps> = ({ label, value, verify }) => {
	return (
		<div className="flex gap-x-6 justify-between items-center w-full px-3.5 py-5">
			<h4 className="text-gray-500 text-sm font-bold">{label}</h4>
			<div className={`text-slate-900 text-sm font-bold`}>
				{label === "Status" ? renderStatus(value ?? "") : value}
				{verify && (
					<div className="px-2 py-1 bg-emerald-50 rounded-lg justify-center items-center gap-1 inline-flex">
						<p className="text-green-600 text-xs font-semibold leading-3 flex gap-x-1">
							Verified <TickIcon />
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

// Component to display user record
export function UserRecord({ user }: IUserRecordProps) {
	const UserData = [
		{ label: "User ID", value: user?.id },
		{ label: "Email Address", value: user?.email, verify: user?.isEmailVerified },
	];

	return (
		<Card className="p-3.5 !bg-slate-50 mb-4">
			{UserData.map((detail, index) => (
				<UserInfoItem
					key={index}
					label={detail.label}
					value={detail.value?.length == 0 ? "N/A" : detail.value}
					verify={detail.verify}
				/>
			))}
		</Card>
	);
}

export function UserRecordList({ user }: IUserRecordProps) {
	const UserData = [
		{ label: "Position/Role", value: user?.role.join(", ") },
		{ label: "Country", value: user?.countryName },
		{ label: "Phone Number", value: user?.phone, verify: user?.isPhoneVerified },
		{ label: "Date/Time", value: user?.createdAt ? formattedDate(user?.createdAt) : "" },
		{ label: "Status", value: user?.status },
	];

	return (
		<Card className="p-3.5 !bg-slate-50 mb-4">
			{UserData.map((detail, index) => (
				<UserInfoItem
					key={index}
					label={detail.label}
					value={detail.value?.length === 0 ? "N/A" : detail.value}
					verify={detail.verify}
				/>
			))}
		</Card>
	);
}

UserDetails.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default UserDetails;
