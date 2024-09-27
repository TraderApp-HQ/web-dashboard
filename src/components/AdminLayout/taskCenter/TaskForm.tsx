import { useState } from "react";
import Button from "~/components/common/Button";
import Checkbox from "~/components/common/CheckBox";
import InputField from "~/components/common/InputField";
import SelectBox from "~/components/common/SelectBox";
import TextArea from "~/components/common/TextArea";
import {
	FormData,
	taskCategory,
	TaskCategoryProps,
	TaskFormError,
	TaskFormProps,
	taskPlatform,
} from "./taskFormData";

type ActionKeys = keyof FormData["actions"];

const TaskForm = ({ onClose }: TaskFormProps) => {
	// Form initial values
	const initialTaskFormvalue = {
		title: "",
		description: "",
		objective: "",
		category: taskCategory[0].value,
		platform: taskPlatform[0].value,
		link: null,
		actions: {
			likePost: false,
			followPage: false,
			sharePost: false,
			commentOnPost: false,
		},
		points: 0,
		startDate: new Date(),
		dueDate: new Date(),
	};

	// Form error values
	const initialTaskFormError = {
		title: null,
		link: null,
		actions: null,
		points: null,
		startDate: null,
		dueDate: null,
	};

	const [formData, setFormData] = useState<FormData>(initialTaskFormvalue);
	const [formInputError, setFormInputError] = useState<TaskFormError>(initialTaskFormError);

	// Handler for form input update
	const updateFormData = (
		field: keyof FormData,
		value: string | number | Date | ActionKeys | TaskCategoryProps,
	) => {
		setFormData((prevData) => {
			if (field === "actions") {
				return {
					...prevData,
					actions: {
						...prevData.actions,
						[value as ActionKeys]: !prevData.actions[value as ActionKeys],
					},
				};
			}
			return {
				...prevData,
				[field]: value,
			};
		});
	};

	// Handler for form input error
	const handleFormError = (field: keyof TaskFormError, value: string | null) => {
		setFormInputError((prev) => {
			return {
				...prev,
				[field]: value,
			};
		});
	};

	// Function to format the Date object
	const formatDateForInput = (date: Date): string => {
		const yyyy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
		const dd = String(date.getDate()).padStart(2, "0");
		const hh = String(date.getHours()).padStart(2, "0");
		const min = String(date.getMinutes()).padStart(2, "0");

		return `${yyyy}-${mm}-${dd}T${hh}:${min}`; // Format for datetime-local input
	};

	// Handler for form submittion
	const submitTask = () => {
		setFormInputError(initialTaskFormError);
		try {
			// Extract form values
			const {
				title,
				description,
				objective,
				category,
				platform,
				link,
				actions: { commentOnPost, followPage, likePost, sharePost },
				points,
				startDate,
				dueDate,
			} = formData;

			// Track validation status
			let hasError = false;

			// Form input validation
			if (title.length < 5) {
				handleFormError("title", "Title cannot be less than 5chars.");
				hasError = true;
			}
			if (!link) {
				handleFormError("link", "Task link must be provided.");
				hasError = true;
			}
			if (!commentOnPost && !followPage && !likePost && !sharePost) {
				handleFormError("actions", "Specify expected actions.");
				hasError = true;
			}
			if (points <= 0) {
				handleFormError("points", "Points value must be greater than zero(0)");
				hasError = true;
			}
			if (startDate < new Date()) {
				handleFormError("startDate", "Start date cannot be in the past.");
				hasError = true;
			}

			if (dueDate <= startDate) {
				handleFormError("dueDate", "Due date must be later than the start date.");
				hasError = true;
			}

			if (hasError) return;

			const data = {
				title,
				description,
				objective,
				category,
				platform,
				link,
				likePost,
				followPage,
				sharePost,
				commentOnPost,
				points,
				startDate,
				dueDate,
			};

			//console value
			console.log("form Data", data);

			// Reset form if request is successful
			setFormData(initialTaskFormvalue);

			// close form
			onClose();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<form className="my-4 space-y-5">
			<InputField
				labelText="Title"
				type="text"
				labelClassName="text-textColor"
				placeholder="Create new post on:"
				value={formData.title}
				onChange={(value) => updateFormData("title", value)}
				inputError={formInputError.title}
			/>

			<TextArea
				label="Task Description"
				placeholder="Provide detailed instructions on how to complete the task, including any specific steps the user must follow (e.g., 'Post a screenshot of your TraderApp portfolio on your Instagram story and tag  @TraderAppOfficial')"
				value={formData.description}
				onChange={(value) => updateFormData("description", value)}
			/>

			<InputField
				labelText="Objective(Optional)"
				type="text"
				labelClassName="text-textColor"
				placeholder="Social Media Engagement: Requires users to interact with TraderApp's content on social media platforms"
				value={formData.objective}
				onChange={(value) => updateFormData("objective", value)}
			/>

			<SelectBox
				labelText="Category"
				placeholder={taskCategory[0].displayText}
				options={taskCategory}
				isSearchable={true}
				option={taskCategory[0]}
				setOption={({ value }) => updateFormData("category", value)}
			/>

			<SelectBox
				labelText="Platform"
				placeholder={taskPlatform[0].displayText}
				options={taskPlatform}
				option={taskPlatform[0]}
				setOption={({ value }) => updateFormData("platform", value)}
			/>

			<InputField
				labelText="Link"
				type="text"
				labelClassName="text-textColor"
				placeholder="https://instagram.com"
				value={formData?.link ?? ""}
				onChange={(value) => updateFormData("link", value)}
				inputError={formInputError.link}
			/>

			<section>
				<p className="text-sm font-normal text-textColor flex">Expected Actions</p>
				{formInputError.actions && (
					<p className="pl-2 font-normal text-red-600 text-[12px]">
						{formInputError.actions}
					</p>
				)}

				<Checkbox
					label="Like Post"
					className="bg-[#F5F8FE] p-4 rounded-lg"
					checked={formData.actions.likePost}
					onChange={() => updateFormData("actions", "likePost")}
				/>
				<Checkbox
					label="Follow Page"
					className="bg-[#F5F8FE] p-4 rounded-lg"
					checked={formData.actions.followPage}
					onChange={() => updateFormData("actions", "followPage")}
				/>
				<Checkbox
					label="Share Post"
					className="bg-[#F5F8FE] p-4 rounded-lg"
					checked={formData.actions.sharePost}
					onChange={() => updateFormData("actions", "sharePost")}
				/>
				<Checkbox
					label="Comment on Post"
					className="bg-[#F5F8FE] p-4 rounded-lg"
					checked={formData.actions.commentOnPost}
					onChange={() => updateFormData("actions", "commentOnPost")}
				/>
			</section>

			<InputField
				labelText="Points"
				type="number"
				labelClassName="text-textColor"
				placeholder="0"
				value={formData.points?.toString()} // converts value back to string
				onChange={(value) => updateFormData("points", +value)} //converts value back to number before saving it
				inputError={formInputError.points}
			/>

			<InputField
				labelText="Start Date"
				type="datetime-local"
				labelClassName="text-textColor"
				value={formatDateForInput(formData.startDate)}
				onChange={(value) => {
					const currentDate = new Date();
					const startDate = new Date(value);

					if (startDate < currentDate) {
						handleFormError("startDate", "Start date cannot be in the past.");
						return;
					}
					handleFormError("startDate", null);
					updateFormData("startDate", startDate);
				}}
				inputError={formInputError.startDate}
			/>

			<InputField
				labelText="Due Date"
				type="datetime-local"
				labelClassName="text-textColor"
				value={formatDateForInput(formData.dueDate)}
				onChange={(value) => {
					const dueDate = new Date(value);
					if (dueDate <= formData.startDate) {
						handleFormError("dueDate", "Due date must be later than the start date.");
						return;
					}
					handleFormError("dueDate", null);
					updateFormData("dueDate", dueDate);
				}}
				inputError={formInputError.dueDate}
			/>

			<Button
				labelText="create new task"
				onClick={submitTask}
				className="capitalize px-10 mt-6 text-sm font-bold w-full"
			/>
		</form>
	);
};

export default TaskForm;
