import React from "react";
import type { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";
import CloudIcon from "~/components/icons/CloudIcon";

interface Props {
	acceptedFiles: string;
	getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T; // Function to get props for dropzone root
	getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T; // Function to get props for dropzone input
}

// UploadButton component to handle file uploads
const UploadButton: React.FC<Props> = ({ acceptedFiles, getRootProps, getInputProps }) => {
	return (
		<div
			// Applying props to the root div of the dropzone to enable dropzone functionality into the component
			{...getRootProps({
				className:
					"dropzone py-6 px-6 bg-white rounded border border-dotted border-neutral-500 cursor-pointer",
			})}
		>
			{/* Input field for selecting files */}
			<input {...getInputProps()} />

			{/* Displaying the uploaded file if available */}
			{acceptedFiles.length > 0 ? (
				<img
					src={acceptedFiles}
					alt={acceptedFiles}
					className="max-w-[650px] max-h-[400px]"
					width="650px"
					height="400px"
				/>
			) : (
				/* Prompt to drag or choose a file */
				<div className="flex gap-1 text-gray-400 text-sm font-normal leading-tight justify-center">
					<span>
						{/* Cloud icon indicating file upload */}
						<CloudIcon />{" "}
					</span>
					<p>Drag file here to upload document or </p>{" "}
					<p className="text-gray-500 text-sm font-normal leading-tight">choose file</p>
				</div>
			)}
		</div>
	);
};

export default UploadButton;
