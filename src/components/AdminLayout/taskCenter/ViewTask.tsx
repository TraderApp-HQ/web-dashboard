import Image from "next/image";
import { renderStatus } from "~/helpers";
import { ITaskWithPopulate } from "~/apis/handlers/users/interfaces";
import React from "react";

interface IViewTaskProps {
	selectedTask: ITaskWithPopulate;
}

const ViewTask: React.FC<IViewTaskProps> = ({ selectedTask }) => {
	return (
		<section className="space-y-5">
			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-3">
				<h3 className="text-textBlack text-base font-bold">Objective</h3>
				<p className="text-textLight text-base font-normal">{selectedTask.objective}</p>
			</section>
			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-3">
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-textBlack text-base font-bold">Category</h3>
					<p className="text-textLight text-base font-semibold capitalize">
						{selectedTask?.category}
					</p>
				</section>
				<section className="flex items-center justify-between py-3">
					<h3 className="text-textBlack text-base font-bold">Platform</h3>
					<section className="flex items-center gap-4">
						{selectedTask && selectedTask.platformId && (
							<Image
								src={selectedTask.platformId.logoUrl}
								width={28}
								height={28}
								alt={selectedTask.platformName || "Icon"}
								className="rounded-lg"
							/>
						)}
						<p className="text-textColor text-base font-bold capitalize">
							{selectedTask?.platformName}
						</p>
					</section>
				</section>
			</section>
			<section className="bg-textCardBg px-3 rounded-xl space-y-3">
				<h3 className="text-textBlack text-base font-bold">TaskType</h3>
				<p className="text-textLight text-base font-normal">{selectedTask?.taskType}</p>
			</section>

			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-3">
				<h3 className="text-textBlack text-base font-bold">Description</h3>
				<p className="text-textLight text-base font-normal">{selectedTask?.description}</p>
			</section>
			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-5">
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-textBlack text-sm font-bold">Point</h3>

					<section className="flex px-3 py-1.5 font-black rounded-lg justify-center items-center gap-2 bg-textCardBg">
						<div className={`p-1 rounded-full bg-[#08875D]`}></div>
						<div className="capitalize text-base font-semibold text-[#08875D]">
							{selectedTask?.points} points
						</div>
					</section>
				</section>
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-textBlack text-sm font-bold">Due Date</h3>
					<p className="text-textLight text-base font-medium capitalize">
						{selectedTask.dueDate && new Date(selectedTask.dueDate).toDateString()}
					</p>
				</section>
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-textBlack text-sm font-bold">Action</h3>
					<section className="flex items-center gap-3">
						{selectedTask.expectedActions?.map((action, index) => (
							<p
								key={index}
								className="text-textLight text-base font-medium capitalize"
							>
								{action}
							</p>
						))}
					</section>
				</section>
				<section className="flex items-center justify-between pb-2">
					<h3 className="text-textBlack text-sm font-bold">Status</h3>
					<section className="text-textLight text-base font-medium capitalize">
						{renderStatus(selectedTask.status)}
					</section>
				</section>
			</section>
		</section>
	);
};

export default ViewTask;
