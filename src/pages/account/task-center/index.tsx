import Card from "~/components/AccountLayout/Card";
import IconButton from "~/components/AccountLayout/IconButton";
import AccountLayout from "~/components/AccountLayout/Layout";
import PageTab from "~/components/AccountLayout/Tabs";
import RightLongArrowIcon from "~/components/icons/RightLongArrowIcon";
import UserTaskPointIcon from "~/components/icons/UserTaskPointIcon";

const UserTaskDashboard = () => {
	const taskTabs = [
		{ title: "All Tasks", href: "", query: "all" },
		{ title: "Pending Tasks", href: "", query: "pending" },
		{ title: "Completed Tasks", href: "", query: "completed" },
	];

	return (
		<section className="space-y-10">
			<section className="flex items-center justify-between">
				<h1>Task Center</h1>
				<IconButton btnClass="bg-buttonColor gap-2 px-4 py-2 rounded-lg text-white">
					Redeem Points <RightLongArrowIcon />{" "}
				</IconButton>
			</section>

			<Card className="max-w-[21rem] flex items-start justify-between px-4 py-2">
				<section className="space-y-10">
					<p className="font-semibold">Accumulated Points</p>
					<p className="font-bold text-2xl">24</p>
				</section>

				<section className="bg-[#E7ECFE] p-2 w-fit rounded-full">
					<UserTaskPointIcon />
				</section>
			</Card>

			<section>
				<PageTab tabs={taskTabs} />
			</section>
		</section>
	);
};

UserTaskDashboard.getLayout = (page: React.ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default UserTaskDashboard;
