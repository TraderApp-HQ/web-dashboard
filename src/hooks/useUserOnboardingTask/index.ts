import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { UsersService } from "~/apis/handlers/users";
import { UserOnboardingTaskField, UserTaskStatus } from "~/apis/handlers/users/enums";
import { IFetchOnboardingTasks, IUserProfile } from "~/apis/handlers/users/interfaces";
import { Tier } from "~/components/common/ProgressTracker/types";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import { redirectTo } from "~/utils/RedirectTo";
import { useCreate } from "../useCreate";
import { UsersQueryId } from "~/apis/handlers/users/constants";

interface IGetUserOnboardingData {
	userProfile: IUserProfile;
	onboardingTasks: IFetchOnboardingTasks;
}

interface IReturnUserOnboardingData {
	showOnboardingStepsPanel: boolean;
	showDismissOnboardingPanelBtn: boolean;
	tasks: Record<string, Tier>;
	optionalTasks: Record<string, Tier>;
	handleOnboardingPanelDisplay: () => void;
}

export const useGetUserOnboardingFlowData = ({
	userProfile,
	onboardingTasks,
}: IGetUserOnboardingData): IReturnUserOnboardingData => {
	const [showOnboardingStepsPanel, setShowOnboardingStepsPanel] = useState<boolean>(true);
	const [showDismissOnboardingPanelBtn, setShowDismissOnboardingPanelBtn] =
		useState<boolean>(false);
	const {
		showOnboardingSteps,
		isEmailVerified,
		isFirstDepositMade,
		isTradingAccountConnected,
		isSocialAccountConnected,
		isOnboardingTaskDone,
		facebookUsername,
		instagramUsername,
		twitterUsername,
		tiktokUsername,
	} = userProfile || {};

	const { updateUserOnboardingStatus } = useUpdateUserOnboardingStatus();

	// Handlers
	// Memoized handler to avoid stale closures
	const handleOnboardingPanelDisplay = useCallback(() => {
		if (isEmailVerified && isFirstDepositMade && isTradingAccountConnected) {
			setShowOnboardingStepsPanel(false);
			updateUserOnboardingStatus({ field: UserOnboardingTaskField.SHOW_ONBOARDING_STEPS });
		}
	}, [
		isEmailVerified,
		isFirstDepositMade,
		isTradingAccountConnected,
		updateUserOnboardingStatus,
	]);

	// Handle display of onbaording steps sync with user profile
	useEffect(() => {
		if (userProfile) {
			setShowOnboardingStepsPanel(showOnboardingSteps);
		}
	}, [showOnboardingSteps, userProfile]);

	// Handle show dismiss button only when all required steps are done
	useEffect(() => {
		setShowDismissOnboardingPanelBtn(
			isEmailVerified && isFirstDepositMade && isTradingAccountConnected,
		);
	}, [isEmailVerified, isFirstDepositMade, isTradingAccountConnected]);

	// Handle social accounts connection status
	useEffect(() => {
		if (showOnboardingSteps && !isSocialAccountConnected) {
			const socialAccountConnected =
				!!facebookUsername && !!instagramUsername && !!tiktokUsername && !!twitterUsername;

			// Call backend API to save option in DB
			if (socialAccountConnected) {
				updateUserOnboardingStatus({
					field: UserOnboardingTaskField.IS_SOCIAL_ACCOUNT_CONNECTED,
				});
			}
		}

		// Edge case: All onboarding steps are done but showOnboardingStep is still true
		if (
			showOnboardingSteps &&
			isEmailVerified &&
			isFirstDepositMade &&
			isTradingAccountConnected &&
			isSocialAccountConnected &&
			isOnboardingTaskDone
		) {
			updateUserOnboardingStatus({ field: UserOnboardingTaskField.SHOW_ONBOARDING_STEPS });
		}
	}, [
		showOnboardingSteps,
		isEmailVerified,
		isFirstDepositMade,
		isTradingAccountConnected,
		isSocialAccountConnected,
		isOnboardingTaskDone,
		facebookUsername,
		instagramUsername,
		tiktokUsername,
		twitterUsername,
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
					field: UserOnboardingTaskField.IS_ONBOARDING_TASK_DONE,
				});
			}
		}
	}, [onboardingTasks, userProfile]);

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
					buttonAction: () => {},
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
					text: "To finalise your registration and unlock the full access of your account. A $10 activation fee will be deducted from your first payment.",
					buttonText: "Make First Deposit",
					buttonAction: () => redirectTo(`${ROUTES.wallet.deposit}?isFirstDeposit`),
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
					buttonAction: () => {},
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
