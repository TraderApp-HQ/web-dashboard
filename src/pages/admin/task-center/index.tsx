import { useState } from "react";
import DropdownMenu from "~/components/AccountLayout/DropdownMenu";
import SearchForm from "~/components/AccountLayout/SearchForm";
import AdminLayout from "~/components/AdminLayout/Layout";
import TaskForm from "~/components/AdminLayout/taskCenter/TaskForm";
import Button from "~/components/common/Button";
import DropdownIcon from "~/components/icons/DropdownIcon";
import Modal from "~/components/Modal";

const TaskCenter = () => {
	const [openTaskModal, setOpenTaskModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const closeModal = () => setOpenTaskModal(false);

	return (
		<section className="">
			<h1 className="mb-8 text-xl font-bold leading-loose">Task Center</h1>

			<section className="flex flex-row items-center -mt-6">
				<SearchForm
					onChange={(e) => setSearchTerm(e.target.value)}
					aria-label="search asset"
					placeHolder="Search for task title, status, etc..."
					// onSubmit={handleSearch}
				/>

				<DropdownMenu
					className="w-[256px]"
					btnClass="w-24 h-12 px-1.5 py-3 bg-white rounded-lg border border-[#E1E6EF]"
					trigger={
						<>
							<div className="text-sky-900 text-base font-normal leading-snug">
								Filter
							</div>
							<DropdownIcon />
						</>
					}
					position="left"
				>
					<p>DropDown Item</p>
					{/* <DropdownMenuItem className="flex flex-col gap-y-2">
							<Select
								name="assets"
								label="Assets"
								options={signalsData.assets}
								classNames={{
									input: "cursor-pointer",
								}}
								onChange={(e) => setAsset(e.target.value)}
								selected={{ value: asset }}
							/>
							<Select
								name="createdAt"
								label="CreatedAt"
								options={signalsData.createdAtList}
								classNames={{
									input: "cursor-pointer",
								}}
								onChange={(e) => setCreatedAt(e.target.value)}
								selected={{ value: createdAt }}
							/>
							<Date
								label="Date"
								name="selectedDate"
								value={selectedDate}
								onChange={handleDateChange}
								required
							/>
					</DropdownMenuItem> */}
				</DropdownMenu>
			</section>

			<section className="bg-white flex items-center justify-center rounded-md mt-6">
				<section className="text-center p-[2rem] max-w-[32rem] my-8">
					<h3 className="font-semibold text-xl text-textColor mb-2">
						No task recorded yet
					</h3>
					<p className="text-[#808080] font-medium text-base md:text-lg">
						Once a task has been added to the system, it will be displayed here.
					</p>

					<Button
						labelText="create new task"
						onClick={() => setOpenTaskModal(true)}
						className="capitalize px-10 mt-6 text-sm font-bold"
					/>
				</section>
			</section>

			{/* Task Modal */}
			<Modal
				title={
					<p className="capitalize font-bold text-xl md:text-2xl text-textColor">
						create new task
					</p>
				}
				description={
					<span className="font-normal text-sm md:text-base text-[#808080]">
						Please provide the information below
					</span>
				}
				headerDivider={true}
				openModal={openTaskModal}
				onClose={closeModal}
			>
				<TaskForm onClose={closeModal} />
			</Modal>
		</section>
	);
};

TaskCenter.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default TaskCenter;
