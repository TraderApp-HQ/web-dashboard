import Card from "~/components/AccountLayout/Card";
import NoSignalAvailableIcon from "~/components/icons/NoSignalAvailableIcon";

export default function EmptySignal() {
	return (
		<Card className="w-full sm:h-[634px] h-[509px] md:px-4 lg:px-96 px-12 justify-center items-center flex">
			<div
				data-testId="empty-signal"
				className="flex-col justify-start items-center gap-4 inline-flex"
			>
				<div>
					<NoSignalAvailableIcon />
				</div>
				<div className="sm:text-lg text-base sm:font-extrabold font-bold sm:leading-normal leading-tight">
					No Signal Available please try later
				</div>
				<div className="text-sm sm:font-normal font-bold leading-none">
					All signal will be displayed here{" "}
				</div>
			</div>
		</Card>
	);
}
