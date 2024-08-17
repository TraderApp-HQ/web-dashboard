import Button from "~/components/common/Button";
import Card from "~/components/AccountLayout/Card";
import { ROUTES } from "~/config/constants";
import { useRouter } from "next/router";

export default function EmptyUser() {
	const router = useRouter();
	return (
		<Card className="flex flex-col gap-4 justify-center items-center sm:px-8 w-full sm:w-[430px] sm:h-[204px]">
			<h1 className="text-xl font-bold sm:leading-loose">No user recorded yet</h1>
			<p className="text-center text-gray-400">
				Once a user has been added to the system, it will be displayed here.
			</p>
			<Button
				onClick={() => router.push(`user-management/${ROUTES.usermanagement.create}`)}
				labelText="Create new user"
			/>
		</Card>
	);
}
