/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from "react";
import { UsersService } from "~/apis/handlers/users";
import type { IUserProfile } from "~/apis/handlers/users/interfaces";
import Toast from "~/components/common/Toast";
import DisableIcon from "~/components/icons/DisableIcon";
import { UserStatus } from "~/config/enum";
import { useCreate } from "~/hooks/useCreate";

interface ConfirmModalProps {
	user: IUserProfile;
	isOpen: boolean;
	onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ user, isOpen, onClose }) => {
	if (!isOpen) return null;
	const usersService = new UsersService();

	// Setup query to backend
	const {
		mutate: toggleUserActivation,
		isError,
		isPending,
		error,
		isSuccess,
		data,
	} = useCreate({
		mutationFn: usersService.toggleUserActivation.bind(usersService),
	});

	// Make call to backend
	const handleDisableUser = () => {
		toggleUserActivation({
			userId: user.id,
		});
	};

	useEffect(() => {
		if (isSuccess && data) {
			setTimeout(() => {
				onClose();
			}, 2000);
		}
	}, [isSuccess, data]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
				<div className="flex justify-center">
					<DisableIcon />
				</div>
				<h2 className="text-center text-2 font-bold">
					{user.status === UserStatus.ACTIVE ? "Deactivate User" : "Reactivate User"}
				</h2>
				<p className="flex justify-center text-slate-400 text-sm my-4">
					{user.status === UserStatus.ACTIVE
						? "Are you sure you want to remove this user from your system ?"
						: "Are you sure you want to reactivate this user ?"}
				</p>
				<div className="flex justify-center gap-4 mt-8">
					<button
						className="px-4 py-2 bg-blue-800 text-white border-radius rounded-md"
						onClick={handleDisableUser}
					>
						{!isPending
							? user.status === UserStatus.ACTIVE
								? "Remove User"
								: "Reactivate User"
							: "... Processing"}
					</button>
					<button
						className="px-4 py-2 bg-white text-black border rounded-md"
						onClick={onClose}
					>
						Cancel Request
					</button>
				</div>
			</div>
			{isError && (
				<Toast
					type="error"
					variant="filled"
					title="User Status Update Error"
					message={error?.message ?? "Something went wrong!"}
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
			{data && (
				<Toast
					type="success"
					variant="filled"
					title="User Status Updated"
					message="Successful!"
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
		</div>
	);
};

export default ConfirmModal;
