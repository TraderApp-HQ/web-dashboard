import SignalsHistory from "~/components/AdminLayout/Signal/SignalsHistory";
import { NestedSignalsLayout } from "..";

function SignalHistoryPage() {
	return (
		<div>
			<SignalsHistory />
		</div>
	);
}

SignalHistoryPage.getLayout = (page: React.ReactElement) => (
	<NestedSignalsLayout>{page}</NestedSignalsLayout>
);
export default SignalHistoryPage;
