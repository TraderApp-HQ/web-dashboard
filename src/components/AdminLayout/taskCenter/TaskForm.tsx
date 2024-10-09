import { useMemo, useState } from "react";
import Button from "~/components/common/Button";
import Checkbox from "~/components/common/CheckBox";
import InputField from "~/components/common/InputField";
import SelectBox from "~/components/common/SelectBox";
import TextArea from "~/components/common/TextArea";
import Toast from "~/components/common/Toast";
import {
	CreateTaskFormDataProps,
	Platform,
	PlatformActions,
	taskCategory,
	TaskFormError,
	TaskFormProps,
	taskStatus,
	taskType,
} from "./taskFormData";
import { useCreateTask } from "~/hooks/useTask";

const TaskForm = ({ onClose, isLoading, platforms, task }: TaskFormProps) => {
	const initialFormData = task ? task : {};
	const { createTask, error, isError, isPending } = useCreateTask();
	const [formData, setFormData] = useState<CreateTaskFormDataProps>(
		initialFormData as CreateTaskFormDataProps,
	);
	const [formInputError, setFormInputError] = useState<TaskFormError>({} as TaskFormError);
	const [taskSubmittionError, setTaskSubmittionError] = useState<boolean>(false);

	console.log(formData);

	// Function to dynamically render task platforms based on selected category
	const platformOptions = useMemo(() => {
		const platformList = platforms?.filter((platform) =>
			platform.categories.includes(formData?.category),
		);

		const platformSelectOptions =
			platformList?.length > 0
				? platformList?.map((platform) => {
						return {
							displayText:
								platform.name === "Twitter" ? "X - (Twitter)" : platform.name,
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
	const updateFormData = (
		field: keyof CreateTaskFormDataProps,
		value: string | number | Date,
	) => {
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
	const handleFormError = (field: keyof TaskFormError, value: string) => {
		setFormInputError((prev) => {
			return {
				...prev,
				[field]: value,
			};
		});
	};

	// Function to format the Date object
	const formatDateForInput = (date: Date): string => {
		const newDate = new Date(date);
		const yyyy = newDate?.getFullYear();
		const mm = String(newDate?.getMonth() + 1).padStart(2, "0"); // Months are zero-based
		const dd = String(newDate?.getDate()).padStart(2, "0");
		const hh = String(newDate?.getHours()).padStart(2, "0");
		const min = String(newDate?.getMinutes()).padStart(2, "0");

		return `${yyyy}-${mm}-${dd}T${hh}:${min}`; // Format for datetime-local input
	};

	// Handler for form submittion
	const submitTask = () => {
		setFormInputError({} as TaskFormError);
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
				status,
			} = formData;

			// Track validation status
			let hasError = false;

			// Form input validation
			if (!title || title?.length < 5) {
				handleFormError("title", "Title cannot be less than 5 characters.");
				hasError = true;
			}
			if (!description || description?.length < 5) {
				handleFormError("description", "Description cannot be less than 5 characters.");
				hasError = true;
			}
			if (!taskType) {
				handleFormError("taskType", "Select a task type.");
				hasError = true;
			}
			if (!category) {
				handleFormError("category", "Select a task category.");
				hasError = true;
			}
			if (platformId && !link) {
				handleFormError("link", "Please provide a link to task.");
				hasError = true;
			}
			if (category && !platformName) {
				handleFormError("platform", "Select a task platform.");
				hasError = true;
			}
			if (
				(platformId && !expectedActions) ||
				(expectedActions && expectedActions.length < 1)
			) {
				handleFormError("expectedActions", "No action selected.");
				hasError = true;
			}
			if (platformId && !link) {
				handleFormError("link", "No link provided.");
				hasError = true;
			}
			if (!points || points <= 0) {
				handleFormError("points", "Points value must be greater than zero(0)");
				hasError = true;
			}
			if (!status) {
				handleFormError("status", "Project status is not selected.");
				hasError = true;
			}
			if (startDate && startDate < new Date()) {
				handleFormError("startDate", "Start date cannot be in the past.");
				hasError = true;
			}

			if ((startDate && !dueDate) || (startDate && dueDate && dueDate <= startDate)) {
				handleFormError("dueDate", "Due date must be later than the start date.");
				hasError = true;
			}

			if (hasError) throw new Error();

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
				status,
			};

			// Create task
			createTask(data);

			// Reset form if request is successful
			setFormData({} as CreateTaskFormDataProps);

			// close form
			onClose();
		} catch (error) {
			setTaskSubmittionError(true);
		}
	};

	return (
		<form className="my-4 space-y-5">
			<InputField
				labelText="Title"
				type="text"
				labelClassName="text-textColor"
				placeholder="Create new post on:"
				value={formData?.title || ""}
				onChange={(value) => updateFormData("title", value)}
				inputError={formInputError?.title}
			/>

			<TextArea
				label="Task Description"
				placeholder="Provide detailed instructions on how to complete the task, including any specific steps the user must follow (e.g., 'Post a screenshot of your TraderApp portfolio on your Instagram story and tag  @TraderAppOfficial')"
				value={formData?.description || ""}
				onChange={(value) => updateFormData("description", value)}
				inputError={formInputError?.description}
			/>

			<InputField
				labelText="Objective(Optional)"
				type="text"
				labelClassName="text-textColor"
				placeholder="Social Media Engagement: Requires users to interact with TraderApp's content on social media platforms"
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
				inputError={formInputError?.taskType}
			/>

			<SelectBox
				labelText="Category"
				placeholder="Select Task Category"
				options={taskCategory}
				option={taskCategory.find((category) => category.value === formData?.category)}
				isSearchable={true}
				setOption={({ value }) => updateFormData("category", value)}
				inputError={formInputError?.category}
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
							inputError={formInputError?.platform}
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
								inputError={formInputError?.link}
							/>

							<section>
								<p className="text-sm font-normal text-textColor flex">
									Expected Actions
								</p>
								{formInputError.expectedActions && (
									<p className="pl-2 font-normal text-red-600 text-[12px]">
										{formInputError.expectedActions}
									</p>
								)}

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
				placeholder="0"
				value={formData.points?.toString()} // converts value back to string
				onChange={(value) => updateFormData("points", +value)} //converts value back to number before saving it
				inputError={formInputError?.points}
			/>
			<InputField
				labelText="Start Date"
				type="datetime-local"
				labelClassName="text-textColor"
				value={formData.startDate && formatDateForInput(formData.startDate)}
				onChange={(value) => {
					const currentDate = new Date();
					const startDate = new Date(value);

					if (startDate < currentDate) {
						handleFormError("startDate", "Start date cannot be in the past.");
						return;
					}
					handleFormError("startDate", "");
					updateFormData("startDate", startDate);
				}}
				inputError={formInputError?.startDate}
			/>
			<InputField
				labelText="Due Date"
				type="datetime-local"
				labelClassName="text-textColor"
				value={formData.dueDate && formatDateForInput(formData.dueDate)}
				onChange={(value) => {
					const dueDate = new Date(value);
					if (formData.startDate && dueDate <= formData.startDate!) {
						handleFormError("dueDate", "Due date must be later than the start date.");
						return;
					}
					handleFormError("dueDate", "");
					updateFormData("dueDate", dueDate);
				}}
				inputError={formInputError.dueDate}
			/>

			<SelectBox
				labelText="Task Status"
				placeholder="Select Task Status"
				options={taskStatus}
				option={taskStatus.find((status) => status.value === formData?.status)}
				isSearchable={false}
				setOption={({ value }) => updateFormData("status", value)}
				inputError={formInputError?.status}
			/>

			<Button
				labelText="create new task"
				onClick={submitTask}
				className="capitalize px-10 mt-6 text-sm font-bold w-full"
				disabled={isPending}
			/>
			{(taskSubmittionError || isError) && (
				<Toast
					type="error"
					variant="filled"
					title="Error"
					message={
						isError
							? error?.message
							: "Error creating task, check form body for error messsage."
					}
					autoVanish={true}
					autoVanishTimeout={10}
					onToastClose={() => setTaskSubmittionError(false)}
				/>
			)}
		</form>
	);
};

export default TaskForm;
