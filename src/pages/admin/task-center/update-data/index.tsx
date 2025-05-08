import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PlatformAction } from "~/apis/handlers/users/enums";
import Button from "~/components/AccountLayout/Button";
import UploadButton from "~/components/AccountLayout/UploadButton";
import AdminLayout from "~/components/AdminLayout/Layout";
import SelectBox from "~/components/common/SelectBox";
import Modal from "~/components/Modal";
import { useGetTaskPlatforms, useUpdateTaskPlatformData } from "~/hooks/useTask";

const UpdateData = () => {
	const router = useRouter();
	// Get all platforms
	const { isLoading, platforms } = useGetTaskPlatforms();
	const { isPending, updateTaskPlatformData, error, isError, isSuccess } =
		useUpdateTaskPlatformData();

	const [openTaskModal, setOpenTaskModal] = useState<boolean>(true);
	const [enableUploadButton, setEnableUplaodButton] = useState<boolean>(false);
	const [platform, setPlatform] = useState<string>();
	const [platformAction, setPlatformAction] = useState<string>();
	const [fileString, setFileString] = useState<string>();
	const [fileName, setFileName] = useState<string>();

	const closeModal = () => {
		router.push(".");
		setOpenTaskModal(false);
	};

	const resetInput = () => {
		setPlatform(undefined);
		setPlatformAction(undefined);
		setFileString(undefined);
		setFileName(undefined);
	};

	// Drag and Drop function
	const onDrop = useCallback((acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		// Check if the file is of .csv type and not greater than 1MB
		if (file.type.includes("csv") && file.size <= 1000000) {
			const reader = new FileReader();
			reader.onload = () => {
				// Convert file to base64 and store it in state
				const base64String = reader.result as string;
				setFileString(base64String);
			};

			setFileName(file.name);
			reader.readAsDataURL(file);
		} else {
			console.log("Invalid file format/size:", file.name, file.type, file.size);
		}
	}, []);

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	// Input validation
	useEffect(() => {
		if (!platform || !platformAction || !fileString) {
			return;
		}

		setEnableUplaodButton(true);
	}, [platform, platformAction, fileString]);

	// OnSubmit
	const handleUploadData = async () => {
		if (!platform || !platformAction || !fileString) {
			return;
		}

		const formData = {
			platform,
			platformAction,
			file: fileString,
		};

		await updateTaskPlatformData(formData);
	};

	// Handle success state changes
	useEffect(() => {
		if (isSuccess) {
			resetInput();
			closeModal();
		}
	}, [isSuccess]);

	return (
		<Modal
			title={
				<p
					data-testid="create-new-task-form"
					className="capitalize font-bold text-xl md:text-2xl text-textColor"
				>
					Update Platform Data
				</p>
			}
			description={
				<span className="font-normal text-sm md:text-base tracking-wider leading-6 text-[#808080]">
					Please provide the information below
				</span>
			}
			headerDivider={true}
			openModal={openTaskModal}
			onClose={closeModal}
		>
			<section className="flex flex-col gap-y-3 pt-2">
				<SelectBox
					labelText="Platform"
					isSearchable={false}
					placeholder={isLoading ? "Fetching platforms..." : "Select Platform"}
					options={
						platforms?.map((platform) => ({
							displayText: platform.name,
							value: platform.name,
							imgUrl: platform.logoUrl,
						})) || []
					}
					setOption={({ value }) => setPlatform(value)}
				/>

				<SelectBox
					labelText="Platform Action"
					isSearchable={false}
					placeholder="Select platform action"
					options={Object.values(PlatformAction).map((action) => ({
						displayText: action,
						value: action,
					}))}
					setOption={({ value }) => setPlatformAction(value)}
				/>

				<label
					htmlFor="file upload"
					className="text-slate-900 text-sm font-normal leading-none"
				>
					Select file <small>( max 1MB )</small>
				</label>
				<UploadButton
					acceptedFiles={fileName || ""}
					getRootProps={getRootProps}
					getInputProps={getInputProps}
				/>

				{isError && (
					<p className="text-red-500 text-sm font-normal leading-none">
						{error?.message}
					</p>
				)}
				<Button
					onClick={handleUploadData}
					disabled={!enableUploadButton || isPending}
					type="submit"
					className="mt-2 flex justify-center"
					innerClassName="px-[20%] py-4 capitalize"
				>
					{isPending ? "Uploading Data..." : "Upload Data"}
				</Button>
			</section>
		</Modal>
	);
};

UpdateData.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default UpdateData;
