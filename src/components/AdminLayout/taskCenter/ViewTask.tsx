import Image from "next/image";
import { renderStatus } from "~/helpers";
import { ITaskWithPopulate } from "~/apis/handlers/users/interfaces";
import { PlatformActions, TaskCategory } from "./taskFormData";
import HyperLinkIcon from "~/components/icons/HyperLinkIcon";
import Link from "next/link";

interface IViewTaskProps {
	selectedTask: ITaskWithPopulate;
}

const ViewTask: React.FC<IViewTaskProps> = ({ selectedTask }) => {
	const renderActionStatement = (action: string) => {
		switch (action) {
			case PlatformActions.LIKE:
				return "Like post.";
			case PlatformActions.COMMENT:
				return "Comment on post.";
			case PlatformActions.SHARE:
				return "Share post.";
			case PlatformActions.FOLLOW:
				return "Follow our page";
			case PlatformActions.POST:
				return "Make a post about TraderApp on any social media platform.";
			case TaskCategory.REFERRAL:
				return "Refer a new user to TrapperApp.";
			case TaskCategory.MARKET:
				return "Create awareness about TraderApp on any social media platform.";
			default:
				return "";
		}
	};

	return (
		<section className="space-y-5">
			<section className="bg-textCardBg px-3 py-2 rounded-xl space-y-4">
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-textGray text-sm font-bold">Task Category</h3>
					<p className="text-textLight text-base font-semibold capitalize">
						{renderStatus(selectedTask?.category)}
					</p>
				</section>
				<section className="flex items-center justify-between py-3">
					<h3 className="text-textGray text-sm font-bold">Platform</h3>
					<section className="flex items-center gap-2">
						{selectedTask && selectedTask.platformId && (
							<Image
								src={selectedTask.platformId.logoUrl}
								width={24}
								height={24}
								alt={selectedTask.platformName || "Icon"}
								className="rounded-lg"
							/>
						)}
						<p className="text-textColor text-base font-medium capitalize">
							{selectedTask?.platformName}
						</p>
					</section>
				</section>
				{selectedTask.link && (
					<section className="flex items-center justify-between">
						<h3 className="text-textGray text-sm font-bold">Task Link</h3>
						<Link
							href={selectedTask.link}
							target="_blank"
							className="text-buttonColor font-bold text-base cursor-pointer flex items-center gap-2 border-b-[1px] border-buttonColor"
						>
							Click here to visit post <HyperLinkIcon />
						</Link>
					</section>
				)}
			</section>

			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-3">
				<h3 className="text-textBlack text-base font-bold">Description</h3>
				<p className="text-textLight text-base font-normal">{selectedTask?.description}</p>
			</section>
			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-3">
				<h3 className="text-textBlack text-base font-bold">Expected Action</h3>
				<ul className="list-disc list-inside space-y-2">
					{selectedTask.expectedActions!.length >= 1 ? (
						selectedTask.expectedActions?.map((action, index) => (
							<li key={index} className="text-[#4A5264] font-medium text-sm">
								{renderActionStatement(action)}
							</li>
						))
					) : (
						<li className="text-[#4A5264] font-medium text-sm">
							{renderActionStatement(selectedTask?.category)}
						</li>
					)}
				</ul>
			</section>

			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-5">
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-textGray text-sm font-bold">Point</h3>
					<p className="text-textColor text-base font-semibold capitalize">
						{selectedTask?.points} points
					</p>
				</section>
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-textGray text-sm font-bold">Due Date</h3>
					<p className="text-[#4A5264] text-base font-semibold capitalize">
						{selectedTask.dueDate && new Date(selectedTask.dueDate).toDateString()}
					</p>
				</section>

				<section className="flex items-center justify-between pb-2">
					<h3 className="text-textGray text-sm font-bold">Status</h3>
					<section className="text-textLight text-base font-medium capitalize">
						{renderStatus(selectedTask.status)}
					</section>
				</section>
			</section>
		</section>
	);
};

export default ViewTask;
