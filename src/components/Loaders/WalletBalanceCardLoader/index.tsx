import Line from "../Line";
import Polygon from "../Polygon";

const WalletBalanceCardLoader: React.FC = () => {
	return (
		<section className="bg-white rounded-2xl flex flex-col gap-8 md:items-start md:flex-row md:justify-between w-full p-5 md:py-10">
			<section className="space-y-4 w-full">
				<Line height="sm" width="sm" className="rounded-sm !w-32 md:!w-40" />
				<Line height="md" width="sm" className="rounded-sm !w-32 md:!w-40" />
				<section className="flex flex-row gap-3">
					<Line height="sm" width="sm" className="rounded-sm !w-4" />
					<Line height="sm" width="sm" className="rounded-sm !w-20" />
				</section>
			</section>
			<section className="flex flex-row gap-3">
				<Polygon variant="rounded" size="sm" className="!h-8 !w-28" />
				<Polygon variant="rounded" size="sm" className="!h-8 !w-28" />
			</section>
		</section>
	);
};

export default WalletBalanceCardLoader;
