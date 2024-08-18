import Image from "next/image";

const DashboardAllocation = () => {
	return (
		<div className="shadow-md p-2 rounded-md w-[425] h-[366]">
			<Image src="/images/dashboard_allocation_chart.png" alt="" width={425} height={366} />
		</div>
	);
};

export default DashboardAllocation;
