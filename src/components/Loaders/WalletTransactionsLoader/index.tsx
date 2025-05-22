import Line from "../Line";
import MobileTableLoader from "../MobileTableLoader";
import TableLoader from "../TableLoader";

const WalletTransactionsLoader: React.FC = () => {
	return (
		<section className="space-y-6 md:space-y-10">
			<Line height="lg" width="md" className="rounded-sm" />
			<section className="md:hidden space-y-4">
				<MobileTableLoader />
			</section>
			<section className="bg-white p-6 rounded-2xl hidden md:block">
				<TableLoader />
			</section>
		</section>
	);
};

export default WalletTransactionsLoader;
