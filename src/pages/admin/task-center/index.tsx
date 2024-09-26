import DropdownMenu from "~/components/AccountLayout/DropdownMenu";
import SearchForm from "~/components/AccountLayout/SearchForm";
import AdminLayout from "~/components/AdminLayout/Layout";
import DropdownIcon from "~/components/icons/DropdownIcon";

const TaskCenter = () => {
	return (
		<section className="">
			<h1 className="mb-8 text-xl font-bold leading-loose">Task Center</h1>

			<section className="flex flex-row items-center">
				<SearchForm
					// onChange={(e) => setSearchTerm(e.target.value)}
					aria-label="search asset"
					placeHolder="Search for task title, status, etc..."
					// onSubmit={handleSearch}
				/>

				<DropdownMenu
					className="w-[256px]"
					btnClass="mt-0 w-24 h-12 px-1.5 py-3 bg-sky-200 bg-opacity-20 rounded-lg border"
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
						<form onSubmit={onSubmit} method="post">
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
							<Select
								name="time"
								label="Time"
								options={signalsData.timeList}
								classNames={{
									input: "cursor-pointer",
								}}
								onChange={(e) => setTime(e.target.value)}
								selected={{ value: time }}
							/>
							<Button type="submit" onClick={() => {}} fluid className="mt-2">
								Search
							</Button>
						</form>
					</DropdownMenuItem> */}
				</DropdownMenu>
			</section>
		</section>
	);
};

TaskCenter.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default TaskCenter;
