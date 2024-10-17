const TaskViewLoader = () => {
	return (
		<section className="space-y-5">
			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-3 bg-[#F9FBFF]">
				<h3 className="text-textBlack text-base font-bold">Objective</h3>
				<p className="text-textLight text-base font-normal">{}</p>
			</section>
			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-3 bg-[#F9FBFF]">
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-textBlack text-base font-bold">Category</h3>
					<p className="text-textLight text-base font-semibold capitalize">{}</p>
				</section>
				<section className="flex items-center justify-between py-3">
					<h3 className="text-textBlack text-base font-bold">Platform</h3>
					<section className="flex items-center gap-4">
						{}
						<p className="text-textColor text-base font-bold capitalize">{}</p>
					</section>
				</section>
			</section>
			<section className="bg-textCardBg px-3 rounded-xl space-y-3 bg-[#F9FBFF]">
				<h3 className="text-textBlack text-base font-bold">TaskType</h3>
				<p className="text-textLight text-base font-normal">{}</p>
			</section>

			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-3 bg-[#F9FBFF]">
				<h3 className="text-textBlack text-base font-bold">Description</h3>
				<p className="text-textLight text-base font-normal">{}</p>
			</section>
			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-5  bg-[#F9FBFF]">
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-textBlack text-sm font-bold">Point</h3>

					<section
						className={`flex px-3 py-1.5 font-black rounded-lg justify-center items-center gap-2 bg-[#EDFDF8]`}
					>
						<div className={`p-1 rounded-full bg-[#08875D]`}></div>
						<div className="capitalize text-base font-semibold text-[#08875D]">{}</div>
					</section>
				</section>
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-textBlack text-sm font-bold">Due Date</h3>
					<p className="text-textLight text-base font-medium capitalize">{}</p>
				</section>
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-textBlack text-sm font-bold">Action</h3>
					<section className="flex items-center gap-3">{}</section>
				</section>
				<section className="flex items-center justify-between pb-2">
					<h3 className="text-textBlack text-sm font-bold">Status</h3>
					<section className="text-textLight text-base font-medium capitalize">
						{}
					</section>
				</section>
			</section>
		</section>
	);
};

export default TaskViewLoader;
