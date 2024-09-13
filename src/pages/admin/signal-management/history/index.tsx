import SignalsHistory from "~/components/AdminLayout/Signal/SignalsHistory";
import { AdminNestedSignalsLayout } from "..";

function SignalHistoryPage() {
	return (
		<div>
			<SignalsHistory />
		</div>
	);
}

SignalHistoryPage.getLayout = (page: React.ReactElement) => (
	<AdminNestedSignalsLayout>{page}</AdminNestedSignalsLayout>
);
export default SignalHistoryPage;
