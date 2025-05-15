import Button from "~/components/common/old/Button";
import OrderedListTile from "../../OrderedListTile";
import Link from "next/link";

const FastConnection = () => (
	<div>
		<h3 className="text-center text-zinc-500 text-sm font-bold leading-tight px-1.5">
			TraderApp will receive access to your trading history and balance and will get the
			ability to replace orders on the exchange.
		</h3>
		<OrderedListTile
			items={[
				"Click the “connect” button",
				"Log in to your Binance Account",
				"Confirm your connection to TraderApp",
			]}
		/>
		<Button
			type="submit"
			fluid
			className="mt-2 flex justify-center"
			innerClassName="px-[20%] py-4"
		>
			Connect
		</Button>
		<Link className="my-8 flex justify-center text-blue-800" href={""}>
			<span className="text-base font-medium">Don't have an account?</span>
			<span className="text-base font-bold">&nbsp;Create one now.</span>
		</Link>
	</div>
);

export default FastConnection;
