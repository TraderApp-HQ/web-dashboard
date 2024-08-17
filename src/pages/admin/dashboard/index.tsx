import Card from "~/components/AccountLayout/Card";
import AdminLayout from "~/components/AdminLayout/Layout";

const Dashbaord = () => {
	return (
		<div>
			<h1 className="mb-8 text-xl font-bold leading-loose">Dashboard Overview</h1>
			<div className="flex flex-col gap-12">
				<Card className="p-20 md:w-[40%]">
					<p></p>
				</Card>

				<Card className="p-40">
					<p></p>
				</Card>
			</div>
		</div>
	);
};

Dashbaord.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default Dashbaord;
