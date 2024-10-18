import { useEffect, useMemo, useState } from "react";
import Button from "~/components/common/Button";
import Checkbox from "~/components/common/CheckBox";
import InputField from "~/components/common/InputField";
import SelectBox from "~/components/common/SelectBox";
import TextArea from "~/components/common/TextArea";
import Toast from "~/components/common/Toast";
import { useCreateTask, useUpdateTask } from "~/hooks/useTask";
import {
	ICreateTaskFormData,
	ITaskForm,
	ITaskFormError,
	Platform,
	PlatformActions,
	taskCategory,
	TaskStatus,
	TaskType,
	taskType,
} from "./taskFormData";

const TaskForm: React.FC<ITaskForm> = ({ onClose, isLoading, platforms, task }) => {
	const [formData, setFormData] = useState<ICreateTaskFormData>({} as ICreateTaskFormData);
	const [formInputError, setFormInputError] = useState<ITaskFormError>({} as ITaskFormError);
	const [validFormData, setValidFormData] = useState<boolean>(false);
	const [taskSubmittionError, setTaskSubmittionError] = useState<boolean>(false);

	// on Edit, sets formData to existing task details
	useEffect(() => {
		if (task) {
			setFormData(task);
		}
	}, [task]);

	// Function for creating new task
	const { createTask, error, isError, isPending, isSuccess, successMessage } = useCreateTask();

	// Function for updating a task
	const {
		updateTask,
		error: updateError,
		isError: isUpdateError,
		isPending: isUpdatePending,

		isSuccess: isUpdateSuccess,
		updateMessage,
	} = useUpdateTask();

	const taskSuccess = useMemo(() => {
		const status = isSuccess || isUpdateSuccess;
		const message = successMessage || updateMessage;

		return { status, message };
	}, [isSuccess, isUpdateSuccess]);

	const taskError = useMemo(() => {
		const status = isError || isUpdateError;
		const message = error?.message || updateError?.message;

		return { status, message };
	}, [isError, isUpdateError]);

	const taskStatus = useMemo(() => isPending || isUpdatePending, [isPending, isUpdatePending]);

	// Function to dynamically render task platforms based on selected category
	const platformOptions = useMemo(() => {
		const platformList = platforms?.filter((platform) =>
			platform.categories.includes(formData?.category),
		);

		const platformSelectOptions =
			platformList?.length > 0
				? platformList?.map((platform) => {
						return {
							displayText: platform.name,
							value: platform.name,
						};
					})
				: [
						{
							displayText: "Others",
							value: "Others",
						},
					];

		return { platformList, platformSelectOptions };
	}, [formData.category]);

	// Function to dynamically render expected actions field based on selected platform
	const supportedActionList = useMemo(() => {
		const platform = platforms?.find((platform) => platform._id === formData.platformId);

		return platform?.supportedActions;
	}, [formData.platformId]);

	// Handler for form input update
	const updateFormData = (field: keyof ICreateTaskFormData, value: string | number | Date) => {
		setFormData((prevData) => {
			// This helps to update both platformName and platformId
			if (field === "platformName" && platformOptions.platformList) {
				const selectedPlatform = platformOptions.platformList.find(
					(plaform) => plaform.name === value,
				);

				return {
					...prevData,
					[field]: value as Platform,
					platformId: selectedPlatform?._id,
				};
			}

			// This helps to update the expectedActions array
			if (field === "expectedActions") {
				const actionsArray = !formData.expectedActions
					? [value as PlatformActions]
					: formData.expectedActions.includes(value as PlatformActions)
						? formData.expectedActions.filter((action) => action !== value)
						: [...formData.expectedActions, value as PlatformActions];

				return {
					...prevData,
					[field]: actionsArray as PlatformActions[],
				};
			}

			return {
				...prevData,
				[field]: value,
			};
		});
	};

	// Handler for form input error
	const handleFormError = (field: keyof ITaskFormError, value: string) => {
		setFormInputError((prev) => {
			return {
				...prev,
				[field]: value,
			};
		});
	};

	// Form input validation function
	useEffect(() => {
		const {
			title,
			description,
			taskType,
			category,
			platformId,
			platformName,
			link,
			expectedActions,
			points,
			startDate,
			dueDate,
		} = formData;

		if (
			!title ||
			title?.length < 5 ||
			!description ||
			description?.length < 5 ||
			!taskType ||
			!category ||
			(platformId && !link) ||
			(category && !platformName) ||
			(platformId && !expectedActions) ||
			(expectedActions && expectedActions.length < 1) ||
			!points ||
			points <= 0 ||
			(taskType && taskType === TaskType.TIME_BASED && (!startDate || !dueDate)) ||
			(startDate && dueDate && dueDate.toLocaleString() <= startDate.toLocaleString())
		) {
			setValidFormData(false);
		} else {
			setValidFormData(true);
		}
	}, [formData]);

	// Handler for form submittion
	const submitTask = async () => {
		setFormInputError({} as ITaskFormError);
		try {
			// Extract form values
			const {
				title,
				description,
				objective,
				taskType,
				category,
				platformId,
				platformName,
				link,
				expectedActions,
				points,
				startDate,
				dueDate,
			} = formData;
			const taskId = formData?.id;

			// Track validation status
			let hasError = false;

			// Form input validation

			const currentDate = new Date();
			currentDate.setHours(0, 0, 0, 0); // resets the time to 00:00:00
			if (startDate && new Date(startDate) < currentDate) {
				handleFormError("startDate", "Start date cannot be in the past.");
				hasError = true;
			}

			if (
				(startDate && !dueDate) ||
				(startDate && dueDate && new Date(dueDate) <= new Date(startDate))
			) {
				handleFormError("dueDate", "Due date must be later than the start date.");
				hasError = true;
			}

			if (hasError) {
				throw new Error();
			}

			const data = {
				title,
				description,
				objective,
				taskType,
				category,
				platformId,
				platformName,
				link,
				expectedActions,
				points,
				startDate,
				dueDate,
			};

			// Function consitionally calls either create task or update task
			!taskId ? await createTask(data) : await updateTask({ taskId, data });

			// Reset form if request is successful
			setFormData({} as ICreateTaskFormData);

			// close form
			onClose();
		} catch (error) {
			setTaskSubmittionError(true);
		}
	};

	return (
		<form data-testid="create-task-form" className="my-4 space-y-5 px-2">
			<InputField
				labelText="Title"
				type="text"
				labelClassName="text-textColor"
				placeholder="Create new post"
				value={formData?.title || ""}
				onChange={(value) => updateFormData("title", value)}
			/>

			<TextArea
				label="Task Description"
				placeholder="Provide task description"
				value={formData?.description || ""}
				onChange={(value) => updateFormData("description", value)}
			/>

			<InputField
				labelText="Objective(Optional)"
				type="text"
				labelClassName="text-textColor"
				placeholder="Provide task objectives"
				value={formData?.objective || ""}
				onChange={(value) => updateFormData("objective", value)}
			/>

			<SelectBox
				labelText="Task Type"
				placeholder="Select Task Type"
				options={taskType}
				option={taskType.find((type) => type.value === formData?.taskType)}
				isSearchable={false}
				setOption={({ value }) => updateFormData("taskType", value)}
			/>

			<SelectBox
				labelText="Category"
				placeholder="Select Task Category"
				options={taskCategory}
				option={taskCategory.find((category) => category.value === formData?.category)}
				isSearchable={true}
				setOption={({ value }) => updateFormData("category", value)}
			/>

			{/* Renders when category is selected and platforms data is available */}
			{formData.category && platforms && (
				<>
					{platformOptions.platformSelectOptions && (
						<SelectBox
							labelText="Platform"
							placeholder={isLoading ? "Fetching platforms" : "Select Task Platform"}
							options={platformOptions.platformSelectOptions}
							option={platformOptions.platformSelectOptions.find(
								(platform) => platform.value === formData?.platformName,
							)}
							setOption={({ value }) => updateFormData("platformName", value)}
						/>
					)}

					{formData.platformId && (
						<>
							<InputField
								labelText="Link"
								type="text"
								labelClassName="text-textColor"
								placeholder="www.example.com"
								value={formData?.link ?? ""}
								onChange={(value) => updateFormData("link", value)}
							/>

							<section>
								<p className="text-sm font-normal text-textColor flex">
									Expected Actions
								</p>

								{supportedActionList?.map((action, index) => (
									<Checkbox
										key={index}
										label={action}
										className="bg-[#F5F8FE] p-4 rounded-lg"
										checked={
											formData.expectedActions
												? formData.expectedActions!.includes(
														action as PlatformActions,
													)
												: false
										}
										onChange={() => updateFormData("expectedActions", action)}
									/>
								))}
							</section>
						</>
					)}
				</>
			)}

			<InputField
				labelText="Points"
				type="number"
				labelClassName="text-textColor"
				className="!pr-4 disabled:cursor-not-allowed"
				disable={formData.status && formData.status === TaskStatus.STARTED}
				placeholder="0"
				value={formData.points?.toString() || ""} // converts value back to string
				onChange={(value) => updateFormData("points", +value)} //converts value back to number before saving it
			/>
			{formData.taskType && formData.taskType === `${TaskType.TIME_BASED}` && (
				<>
					<InputField
						labelText="Start Date"
						type="date"
						labelClassName="text-textColor"
						className="!pr-4 disabled:cursor-not-allowed"
						value={
							formData.startDate &&
							new Date(formData.startDate).toLocaleDateString("en-CA")
						}
						disable={formData.status && formData.status === TaskStatus.STARTED}
						onChange={(value) => {
							const currentDate = new Date();
							currentDate.setHours(0, 0, 0, 0); // resets the time to 00:00:00
							const startDate = new Date(value);

							if (startDate < currentDate) {
								handleFormError("startDate", "Start date cannot be in the past.");
								updateFormData("startDate", "");
								return;
							}
							handleFormError("startDate", "");
							updateFormData("startDate", value);
						}}
						inputError={formInputError?.startDate}
					/>
					<InputField
						labelText="Due Date"
						type="date"
						labelClassName="text-textColor"
						className="!pr-4"
						value={
							formData.dueDate &&
							new Date(formData.dueDate).toLocaleDateString("en-CA")
						}
						onChange={(value) => {
							const dueDate = new Date(value);
							if (formData.startDate && dueDate <= new Date(formData.startDate!)) {
								handleFormError(
									"dueDate",
									"Due date must be later than the start date.",
								);
								updateFormData("dueDate", "");
								return;
							}
							handleFormError("dueDate", "");
							updateFormData("dueDate", value);
						}}
						inputError={formInputError.dueDate}
					/>
				</>
			)}

			<Button
				labelText={
					taskStatus
						? "processing . . ."
						: formData?.id
							? "update task"
							: "create new task"
				}
				onClick={submitTask}
				className="capitalize py-4 mt-6 text-sm font-bold w-full disabled:cursor-not-allowed"
				disabled={!validFormData || taskStatus}
			/>

			{!taskStatus && (taskSubmittionError || taskError.status) && (
				<Toast
					type="error"
					variant="filled"
					title="Error"
					message={
						taskError.message ||
						"Error creating task, check form body for error messsage."
					}
					autoVanish={true}
					autoVanishTimeout={10}
					onToastClose={() => setTaskSubmittionError(false)}
				/>
			)}
			{!taskStatus && taskSuccess.status && (
				<Toast
					type="success"
					variant="filled"
					title="Success"
					message={taskSuccess.message}
					autoVanish={true}
					autoVanishTimeout={10}
				/>
			)}
		</form>
	);
};

export default TaskForm;
