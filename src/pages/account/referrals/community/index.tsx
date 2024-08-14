import { NestedReferralsLayout } from "..";

const ReferralsCommunity  = () => {
	return (
		<div>
            <h1>Referrals Community</h1>
		</div>
	);
}

ReferralsCommunity.getLayout = (page: React.ReactElement) => <NestedReferralsLayout>{page}</NestedReferralsLayout>;
export default ReferralsCommunity;
