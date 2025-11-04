import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { UsersService } from "~/apis/handlers/users";
import { UserOnboardingChecklist, UserTaskStatus } from "~/apis/handlers/users/enums";
import { IFetchOnboardingTasks, IUserProfile } from "~/apis/handlers/users/interfaces";
import { Tier } from "~/components/common/ProgressTracker/types";
import { FIRST_DEPOSIT_AMOUNT, LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import { redirectTo } from "~/utils/RedirectTo";
import { useCreate } from "../useCreate";
import { UsersQueryId } from "~/apis/handlers/users/constants";
import { useRouter } from "next/router";

interface IGetUserOnboardingData {
	userProfile: IUserProfile;
	onboardingTasks: IFetchOnboardingTasks;
	refetchUserProfile: () => void;
}

interface IReturnUserOnboardingData {
	showOnboardingStepsPanel: boolean;
	showDismissOnboardingPanelBtn: boolean;
	tasks: Record<string, Tier>;
	optionalTasks: Record<string, Tier>;
	handleOnboardingPanelDisplay: () => void;
	showFirstDepositModal: boolean;
	handleFirstDepositModalDisplay: () => void;
	showSocialAccountsModal: boolean;
	handleSocialAccountsModalDisplay: () => void;
	socialAccountsFormData: ISocialAccounts;
	updateSocialAccountsFormData: (field: keyof ISocialAccounts, value: string) => void;
	handleSocialAccountsUpdate: () => void;
	isUpdatePending: boolean;
	showVerifyEmailOtpModal: boolean;
	handleEmailOtpModalDisplay: (value: boolean) => void;
	toastData: IToastData;
}
interface ISocialAccounts {
	facebookUsername: string;
	instagramUsername: string;
	twitterUsername: string;
	tiktokUsername: string;
}

interface IToastData {
	showToast: boolean;
	type: "success" | "error";
	title: string;
	message: string;
}

export const useGetUserOnboardingFlowData = ({
	userProfile,
	onboardingTasks,
	refetchUserProfile,
}: IGetUserOnboardingData): IReturnUserOnboardingData => {
	const usersService = new UsersService();
	const router = useRouter();
	const { userid, recipient } = router.query;
	const [showOnboardingStepsPanel, setShowOnboardingStepsPanel] = useState<boolean>(true);
	const [showFirstDepositModal, setShowFirstDepositModal] = useState<boolean>(false);
	const [showSocialAccountsModal, setShowSocialAccountsModal] = useState<boolean>(false);
	const [showDismissOnboardingPanelBtn, setShowDismissOnboardingPanelBtn] =
		useState<boolean>(false);
	const [socialAccountsFormData, setSocialAccountsFormData] = useState<ISocialAccounts>(
		{} as ISocialAccounts,
	);
	const [toastData, setToastData] = useState<IToastData>({
		showToast: false,
		type: "success",
		title: "",
		message: "",
	});
	let showVerifyEmailOtpModal: boolean = Boolean(userid && recipient);

	const {
		showOnboardingSteps,
		isEmailVerified,
		isFirstDepositMade,
		isTradingAccountConnected,
		isSocialAccountConnected,
		isOnboardingTaskDone,
		id,
		email,
	} = userProfile || {};

	const { updateUserOnboardingStatus, isSuccess: isUpdateUserOnboardingStatusSuccess } =
		useUpdateUserOnboardingStatus();

	// Verify Email OTP Handler
	const {
		mutate: verifyEmailOtp,
		isPending: isVerifyEmailOtpPending,
		isError: isVerifyEmailOtpError,
		error: verifyEmailOtpError,
		isSuccess: isVerifyEmailOtpSuccess,
	} = useCreate({
		mutationFn: usersService.sendOtp.bind(usersService),
	});

	// Update user social accounts
	const {
		mutate: updateUser,
		isError,
		error,
		isPending,
		isSuccess,
	} = useCreate({
		mutationFn: usersService.updateUser.bind(usersService),
	});

	// Handlers
	// Memoized handler to avoid stale closures
	const handleOnboardingPanelDisplay = useCallback(() => {
		if (isEmailVerified && isFirstDepositMade && isTradingAccountConnected) {
			setShowOnboardingStepsPanel(false);
			updateUserOnboardingStatus({ field: UserOnboardingChecklist.SHOW_ONBOARDING_STEPS });
		}
	}, [
		isEmailVerified,
		isFirstDepositMade,
		isTradingAccountConnected,
		updateUserOnboardingStatus,
	]);

	const handleEmailOtpModalDisplay = (value: boolean) => {
		if (!value) {
			// Clears the query when closeModal() is called
			router.replace(
				{
					pathname: router.pathname,
				},
				undefined,
				{ shallow: true },
			);
		}

		showVerifyEmailOtpModal = value;
	};
	const handleFirstDepositModalDisplay = () => setShowFirstDepositModal((prev) => !prev);
	const handleSocialAccountsModalDisplay = () => {
		setShowSocialAccountsModal((prev) => !prev);
		setSocialAccountsFormData({} as ISocialAccounts);
	};
	const updateSocialAccountsFormData = (field: keyof ISocialAccounts, value: string) => {
		setSocialAccountsFormData((prev) => {
			const trimmedValue = value.trim();

			return {
				...prev,
				[field]: trimmedValue,
			};
		});
	};
	const handleSocialAccountsUpdate = () => {
		updateUser({
			id,
			...socialAccountsFormData,
		});
	};

	// useEffects
	// Handle display of onbaording steps sync with user profile
	useEffect(() => {
		if (userProfile) {
			setShowOnboardingStepsPanel(showOnboardingSteps);
		}
	}, [showOnboardingSteps, userProfile]);

	// Handle dismiss button display
	useEffect(() => {
		setShowDismissOnboardingPanelBtn(
			isEmailVerified && isFirstDepositMade && isTradingAccountConnected,
		);
	}, [isEmailVerified, isFirstDepositMade, isTradingAccountConnected]);

	// Edge case: All onboarding steps are done but showOnboardingStep is still true
	useEffect(() => {
		if (
			showOnboardingSteps &&
			isEmailVerified &&
			isFirstDepositMade &&
			isTradingAccountConnected &&
			isSocialAccountConnected &&
			isOnboardingTaskDone
		) {
			updateUserOnboardingStatus({ field: UserOnboardingChecklist.SHOW_ONBOARDING_STEPS });
		}
	}, [
		showOnboardingSteps,
		isEmailVerified,
		isFirstDepositMade,
		isTradingAccountConnected,
		isSocialAccountConnected,
		isOnboardingTaskDone,
		updateUserOnboardingStatus,
	]);

	// Handle onboarding task completion
	useEffect(() => {
		if (showOnboardingSteps && !isOnboardingTaskDone && onboardingTasks?.onboardingTasks) {
			const onboardingTaskStatus = onboardingTasks.onboardingTasks.every(
				(task) => task.status !== UserTaskStatus.PENDING,
			);

			// Call backend API to save option in DB
			if (onboardingTaskStatus) {
				updateUserOnboardingStatus({
					field: UserOnboardingChecklist.IS_ONBOARDING_TASK_DONE,
				});
			}
		}
	}, [showOnboardingSteps, isOnboardingTaskDone, onboardingTasks, userProfile]);

	// Refetch user profile after successful update
	useEffect(() => {
		if (showOnboardingSteps && isUpdateUserOnboardingStatusSuccess) {
			refetchUserProfile();
		}
	}, [showOnboardingSteps, isUpdateUserOnboardingStatusSuccess, refetchUserProfile]);

	//  Handles modal opening and closing
	useEffect(() => {
		// Close social accounts modal & reload path to refetch user profile
		if (isSuccess && !isError) {
			handleSocialAccountsModalDisplay();
			router.replace(router.asPath);
		}

		// Set query params based on otp verification success
		if (isVerifyEmailOtpSuccess) {
			const newSearchParams = new URLSearchParams();

			newSearchParams.set("userid", id);
			newSearchParams.set("recipient", email);

			router.replace(
				{
					pathname: router.pathname,
					query: Object.fromEntries(newSearchParams.entries()),
				},
				undefined,
				{ shallow: false },
			);
		}
	}, [isSuccess, isVerifyEmailOtpSuccess]);

	// Handle Toast display
	useEffect(() => {
		// Verify email Otp Error
		if (isVerifyEmailOtpError && verifyEmailOtpError) {
			setToastData(() => ({
				showToast: true,
				type: "error",
				title: "Verification Error",
				message:
					verifyEmailOtpError?.message ?? "Error in verifying email. Please try again.",
			}));
		}

		// Update social account error
		if (isError && error) {
			setToastData(() => ({
				showToast: true,
				type: "error",
				title: "Account Update Error",
				message: error?.message ?? "Error in updating social handle. Please try again.",
			}));
		}

		// Update Social Account success
		if (isSuccess) {
			setToastData(() => ({
				showToast: true,
				type: "success",
				title: "Account Update",
				message: "Social handle update successful.",
			}));
		}
	}, [isVerifyEmailOtpError, isSuccess, isError]);

	const tasks = {
		mail: {
			title: "Email Verification",
			icon: "mail",
			milestones: [],
			completed: isEmailVerified,
			actionButton: true as const,
			action: [
				{
					text: "To finalise your registration and unlock the full access of your account, please verify your email address.",
					buttonText: "Verify Email",
					buttonAction: () => verifyEmailOtp({ userId: id }),
					buttonActionLoading: isVerifyEmailOtpPending,
					disableActionButton: isEmailVerified,
				},
			],
		},
		deposit: {
			title: "Make First Deposit",
			icon: "deposit",
			milestones: [],
			completed: isFirstDepositMade,
			actionButton: true as const,
			action: [
				{
					text: `To finalise your registration and unlock the full access of your account. A $${FIRST_DEPOSIT_AMOUNT} activation fee will be deducted from your first payment.`,
					buttonText: "Make First Deposit",
					buttonAction: () => handleFirstDepositModalDisplay(),
					disableActionButton: isFirstDepositMade,
				},
			],
		},
		connect: {
			title: "Connect Trading Account",
			icon: "connect",
			milestones: [],
			completed: isTradingAccountConnected,
			actionButton: true as const,
			action: [
				{
					text: "To finalise your registration and unlock the full access of your account, please connect your trading account.",
					buttonText: "Connect Trading Account",
					buttonAction: () => redirectTo(ROUTES.tradeCenter.connect),
					disableActionButton: isTradingAccountConnected,
				},
			],
		},
	};
	const optionalTasks = {
		social: {
			title: "Add Social Media Accounts",
			icon: "user",
			milestones: [],
			completed: isSocialAccountConnected,
			actionButton: true as const,
			action: [
				{
					text: "To finalise your registration and unlock the full access of your account, please add your social media accounts.",
					buttonText: "Add Accounts",
					buttonAction: () => handleSocialAccountsModalDisplay(),
					disableActionButton: isSocialAccountConnected,
				},
			],
		},
		task: {
			title: "Complete a Task (Follow us, Share a post)",
			icon: "task",
			milestones: [],
			completed: isOnboardingTaskDone,
			actionButton: true as const,
			action:
				onboardingTasks?.onboardingTasks?.map((task) => ({
					text: task.title,
					buttonText: "View Task",
					buttonAction: () =>
						redirectTo(
							`${LAYOUT_ROUTES.account}${ROUTES.rewardHub}${ROUTES.taskcenter.home}/${task.id}`,
						),
					disableActionButton: task.status !== UserTaskStatus.PENDING,
					taskPill: task.status,
				})) ?? [],
		},
	};

	return {
		showOnboardingStepsPanel,
		showDismissOnboardingPanelBtn,
		handleOnboardingPanelDisplay,
		tasks,
		optionalTasks,
		showFirstDepositModal,
		handleFirstDepositModalDisplay,
		showSocialAccountsModal,
		handleSocialAccountsModalDisplay,
		socialAccountsFormData,
		updateSocialAccountsFormData,
		handleSocialAccountsUpdate,
		isUpdatePending: isPending,
		showVerifyEmailOtpModal,
		handleEmailOtpModalDisplay,
		toastData,
	};
};

export const useUpdateUserOnboardingStatus = () => {
	const usersService = new UsersService();
	const queryClient = useQueryClient();

	const {
		mutateAsync: updateUserOnboardingStatus,
		data: updateMessage,
		isError,
		isPending,
		error,
		isSuccess,
	} = useCreate({
		mutationFn: (data: { field: string }) => usersService.updateUserOnboadingStatus(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [UsersQueryId.userProfile] });
		},
	});

	return { updateUserOnboardingStatus, isPending, isSuccess, updateMessage, isError, error };
};
