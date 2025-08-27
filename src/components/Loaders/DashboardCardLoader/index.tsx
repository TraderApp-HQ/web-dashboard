import Polygon from "../Polygon";

const DashboardCardLoader: React.FC = () => {
	return (
		<div className="flex flex-col gap-4 h-60 rounded-lg w-full bg-white p-5 border-2 border-[#D1D7F0]">
			<Polygon
				size="lg"
				variant="rounded"
				opacity="open"
				className="flex-1 w-full h-[20px] mb-2 !bg-transparent"
			/>
			<Polygon
				size="lg"
				variant="rounded"
				opacity="open"
				className="flex-1 w-full h-[20px] mb-2 !bg-transparent"
			/>
		</div>
	);
};

export default DashboardCardLoader;
