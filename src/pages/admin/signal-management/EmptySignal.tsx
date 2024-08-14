import Card from "~/components/AccountLayout/Card";

export default function EmptySignal() {
	return (
		<Card className="w-full sm:h-[634px] h-[509px] md:px-4 lg:px-96 px-12 justify-center items-center flex">
			<p>No Signal Available please try letter</p>
		</Card>
	);
}
