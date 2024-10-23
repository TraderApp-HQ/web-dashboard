import { UsersService } from "~/apis/handlers/users";
import { useCreate } from "../useCreate";
import { useQueryClient } from "@tanstack/react-query";
import { UsersQueryId } from "~/apis/handlers/users/constants";
import { useFetch } from "../useFetch";
import { useCallback } from "react";
import { ICreateTaskFormData } from "~/components/AdminLayout/taskCenter/taskFormData";

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
		mutateAsync: createTask,
		data: successMessage,
		isError,
		error,
		isSuccess,
		isPending,
	} = useCreate({
		mutationFn: (data: ICreateTaskFormData) => usersService.createTask(data),
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
		mutationFn: (variables: { taskId: string; data: ICreateTaskFormData }) =>
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
