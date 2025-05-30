import Card from "~/components/AccountLayout/Card";
import NoSignalAvailableIcon from "~/components/icons/NoSignalAvailableIcon";

export default function EmptyUserList() {
	return (
		<Card className="w-full sm:h-[634px] h-[509px] md:px-4 lg:px-96 px-12 justify-center items-center flex">
			<div className="flex-col justify-start items-center gap-4 inline-flex">
				<div>
					<NoSignalAvailableIcon />
				</div>
				<div className="sm:text-xl text-base sm:font-extrabold font-bold sm:leading-normal leading-tight">
					No user recorded yet
				</div>
				<div className="text-sm sm:font-normal font-bold leading-none">
					Once a user has been added to the system, the details will be displayed here{" "}
				</div>
			</div>
		</Card>
	);
}
