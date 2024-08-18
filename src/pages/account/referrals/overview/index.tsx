import { NestedReferralsLayout } from "..";

const ReferralsOverview = () => {
	return (
		<div>
			<h1>Referrals Overview</h1>
		</div>
	);
};

ReferralsOverview.getLayout = (page: React.ReactElement) => (
	<NestedReferralsLayout>{page}</NestedReferralsLayout>
);
export default ReferralsOverview;
