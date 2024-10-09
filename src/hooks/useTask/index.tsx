import { UsersService } from "~/apis/handlers/users";
import { useCreate } from "../useCreate";
import { useQueryClient } from "@tanstack/react-query";
import { UsersQueryId } from "~/apis/handlers/users/constants";
import { useFetch } from "../useFetch";
import { useCallback } from "react";
import { CreateTaskFormDataProps } from "~/components/AdminLayout/taskCenter/taskFormData";

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

export const useGetAllTasks = () => {
	const usersService = new UsersService();

	const {
		data: tasks,
		isLoading,
		isError,
		error,
	} = useFetch({
		queryKey: [UsersQueryId.task],
		queryFn: usersService.getAllTasks.bind(usersService),
	});

	return { tasks, isLoading, isError, error };
};

export const useCreateTask = () => {
	const usersService = new UsersService();
	const queryClient = useQueryClient();
	const {
		mutate: createTask,
		isError,
		isPending,
		error,
		isSuccess,
	} = useCreate({
		mutationFn: usersService.createTask.bind(usersService),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [UsersQueryId.task] });
		},
	});

	return { createTask, isPending, isSuccess, isError, error };
};

export const useUpdateTask = () => {
	const usersService = new UsersService();
	const queryClient = useQueryClient();

	const {
		mutate: updateTask,
		isError,
		isPending,
		error,
		isSuccess,
	} = useCreate({
		mutationFn: (variables: { taskId: string; data: CreateTaskFormDataProps }) =>
			usersService.updateTask(variables),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [UsersQueryId.task] });
		},
	});

	return { updateTask, isPending, isSuccess, isError, error };
};
