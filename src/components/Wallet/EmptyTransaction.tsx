import Card from "~/components/AccountLayout/Card";
import NoTransactionIcon from "~/components/icons/NoTransactionIcon";

export default function EmptyTransaction() {
	return (
		<Card className="w-full sm:h-[634px] h-[509px] flex flex-col justify-center items-center gap-4 rounded-2xl">
			<NoTransactionIcon />

			<section className="text-center">
				<h2 className="sm:text-2xl text-base sm:font-extrabold font-bold sm:leading-normal leading-tight text-textGray">
					No Transaction made yet.
				</h2>
				<p className="text-sm font-medium leading-normal text-textGray">
					Transactions history will appear hear.
				</p>
			</section>
		</Card>
	);
}
