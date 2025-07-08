import { UsersService } from "~/apis/handlers/users";
import { useCreate } from "../useCreate";
import { useQueryClient } from "@tanstack/react-query";
import { UsersQueryId } from "~/apis/handlers/users/constants";
import { useFetch } from "../useFetch";
import { useCallback } from "react";
import { ICreateUserTask, ITaskData, ITaskPlatformData } from "~/apis/handlers/users/interfaces";

export const useGetTaskPlatforms = () => {
	const usersService = new UsersService();

	const { data: platforms, isLoading } = useFetch({
		queryKey: [UsersQueryId.taskPlatform],
		queryFn: usersService.getAllActiveTaskPlatforms.bind(usersService),
	});

	return { platforms, isLoading };
};

export const useGetTask = (taskId: string) => {
	const usersService = new UsersService();

	const getTask = useCallback(() => usersService.getTask({ taskId }), [taskId, usersService]);
	const {
		data: task,
		isLoading,
		isError,
		error,
	} = useFetch({
		queryKey: [taskId],
		queryFn: getTask,
	});

	return { task, isLoading, isError, error };
};

export const useGetAllTasks = ({ search }: { search?: string }) => {
	const usersService = new UsersService();

	// Memoized function to fetch users
	const fetchTasks = useCallback(
		() => usersService.getAllTasks({ search }),
		[search, usersService],
	);

	const {
		data: tasksDetails,
		isLoading,
		isError,
		error,
		isSuccess,
		refetch,
	} = useFetch({
		queryKey: [UsersQueryId.task],
		queryFn: fetchTasks,
	});

	return { tasksDetails, isLoading, isError, error, isSuccess, refetch };
};

export const useGetAllActiveTasks = () => {
	const usersService = new UsersService();

	// Memoized function to fetch users
	const fetchActiveTasks = useCallback(() => usersService.getAllActiveTasks(), [usersService]);

	const {
		data: activeTasks,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useFetch({
		queryKey: [UsersQueryId.activeTasks],
		queryFn: fetchActiveTasks,
	});

	return { activeTasks, isLoading, isSuccess, isError, error };
};

export const useGetAllPendingTasks = () => {
	const usersService = new UsersService();
	const fetchPendingTasks = useCallback(() => usersService.getAllPendingTasks(), [usersService]);

	const {
		data: pendingTasks,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useFetch({
		queryKey: [UsersQueryId.pendingTasks],
		queryFn: fetchPendingTasks,
	});

	return { pendingTasks, isLoading, isSuccess, isError, error };
};

export const useGetOnboardingTasks = () => {
	const usersService = new UsersService();
	const fetchOnboardingTasks = useCallback(
		() => usersService.getOnboardingTasks(),
		[usersService],
	);

	const {
		data: onboardingTasks,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useFetch({
		queryKey: [UsersQueryId.onboardingTasks],
		queryFn: fetchOnboardingTasks,
	});

	return { onboardingTasks, isLoading, isSuccess, isError, error };
};

export const useCreateTask = () => {
	const usersService = new UsersService();
	const queryClient = useQueryClient();
	const {
		mutateAsync: createTask,
		data: successMessage,
		isError,
		error,
		isSuccess,
		isPending,
	} = useCreate({
		mutationFn: (data: ITaskData) => usersService.createTask(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [UsersQueryId.task] });
		},
	});

	return { createTask, isPending, isSuccess, successMessage, isError, error };
};

export const useUpdateTask = () => {
	const usersService = new UsersService();
	const queryClient = useQueryClient();

	const {
		mutateAsync: updateTask,
		data: updateMessage,
		isError,
		isPending,
		error,
		isSuccess,
	} = useCreate({
		mutationFn: (variables: { taskId: string; data: ITaskData }) =>
			usersService.updateTask(variables),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [UsersQueryId.task] });
		},
	});

	return { updateTask, isPending, isSuccess, updateMessage, isError, error };
};

export const useDeleteTask = () => {
	const usersService = new UsersService();
	const queryClient = useQueryClient();

	const {
		mutateAsync: deleteTask,
		data: deleteMessage,
		isError,
		error,
		isSuccess,
	} = useCreate({
		mutationFn: (taskId: string) => usersService.deleteTask(taskId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [UsersQueryId.task] });
		},
	});

	return { deleteTask, isSuccess, deleteMessage, isError, error };
};

export const useCreateUserTask = () => {
	const usersService = new UsersService();
	const queryClient = useQueryClient();
	const {
		mutateAsync: createUserTask,
		isError,
		error,
		isSuccess,
		isPending,
	} = useCreate({
		mutationFn: (data: ICreateUserTask) => usersService.createUserTask(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [UsersQueryId.activeTasks] });
		},
	});

	return { createUserTask, isPending, isSuccess, isError, error };
};

export const useGetUserTask = (taskId: string) => {
	const usersService = new UsersService();

	const getTask = useCallback(() => usersService.getUserTask({ taskId }), [taskId, usersService]);
	const {
		data: task,
		isLoading,
		isError,
		error,
		refetch,
	} = useFetch({
		queryKey: [taskId],
		queryFn: getTask,
	});

	return { task, isLoading, isError, error, refetch };
};

export const useUpdateTaskPlatformData = () => {
	const usersService = new UsersService();

	const updateTaskPlatform = useCallback(
		(data: ITaskPlatformData) => usersService.updateTaskPlatformData(data),
		[usersService],
	);

	const {
		mutateAsync: updateTaskPlatformData,
		data: successMessage,
		isError,
		error,
		isSuccess,
		isPending,
	} = useCreate({
		mutationFn: updateTaskPlatform,
	});

	return { updateTaskPlatformData, isPending, isSuccess, successMessage, isError, error };
};
