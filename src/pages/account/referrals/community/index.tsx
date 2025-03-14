import { useRouter } from "next/router";
import { NestedReferralsLayout } from "..";
import { FaUsers } from "react-icons/fa";
import { DropdownMenuItem } from "~/components/AccountLayout/DropdownMenu";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import ConnectionsIcons from "~/components/icons/ConnectionsIcons";
import CurrencySymbolsIcon from "~/components/icons/CurrencySymbolsIcon";
import Pagination from "~/components/Pagination";
import { useEffect, useState } from "react";
import {
	communityUsersDataTableSelector,
	communityUsersMobileDataTableSelector,
} from "~/selectors/referrals";
import ReferralCommunityCardLoader from "~/components/Loaders/ReferralCommunityCardLoader";
import useReferrals from "~/hooks/useReferrals";
import ReferalCard from "~/components/Cards/ReferalCard";
import MobileTableLoader from "~/components/Loaders/MobileTableLoader";
import TableLoader from "~/components/Loaders/TableLoader";
import Card from "~/components/AccountLayout/Card";
import NoTransactionIcon from "~/components/icons/NoTransactionIcon";
import { useReferralOverview } from "~/hooks/useReferralOverview";

const ReferralsCommunity = () => {
	const router = useRouter();

	const { data: stats, isLoading: isLoadingStats } = useReferralOverview();
	const searchKeywordInitial = Array.isArray(router.query.query)
		? router.query.query[0]
		: router.query.query || "";
	const params = new URLSearchParams();

	const [searchKeyword, setSearchKeyword] = useState(searchKeywordInitial);
	const [currentPage, setCurrentPage] = useState(Number(router.query.page) || 1);
	const [rowsPerPage, setRowsPerPage] = useState(Number(router.query.rows) || 10);

	const { data, refetch, error, isLoading, isSuccess, isError } = useReferrals({
		searchKeyword,
		currentPage,
		rowsPerPage,
	});

	useEffect(() => {
		if (currentPage) {
			params.set("page", currentPage.toString());
		}
		if (rowsPerPage) {
			params.set("rows", rowsPerPage.toString());
		}
		if (searchKeyword) {
			params.set("query", searchKeyword);
		}
	}, [currentPage, rowsPerPage, searchKeyword]);

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		if (searchKeyword) {
			params.set("query", searchKeyword);
		}
		router.push({
			pathname: router.pathname,
			query: params.toString(),
		});

		e.preventDefault();
		refetch();
	};

	// if (isLoading) {
	// 	return <div>Loading...</div>;
	// }

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	const referrals = isSuccess ? data.referrals : [];
	const { tableHead, tableBody } = communityUsersDataTableSelector(referrals);
	const mobileData = communityUsersMobileDataTableSelector(referrals);

	return (
		<div>
			{isLoadingStats && <ReferralCommunityCardLoader />}
			{stats && (
				<div className="flex flex-col md:flex-row gap-2 mb-10">
					<ReferalCard
						title="Community Members"
						subtext={`${stats.communitySize}`}
						Icon={() => <FaUsers color="#102477" size={"24"} />}
					/>
					<ReferalCard
						title="Community ATC"
						subtext={`$ ${stats.communityATC}`}
						Icon={CurrencySymbolsIcon}
					/>
					<ReferalCard
						title="Referral Tree Levels"
						subtext={`${stats.referralTreeLevels}`}
						Icon={ConnectionsIcons}
					/>
				</div>
			)}

			<section>
				{referrals.length === 0 && !isLoading ? (
					<>
						<Card className="flex flex-col justify-center items-center h-[330px]">
							<NoTransactionIcon />
							<div className="text-[#414141] text-center mt-4">
								<h3 className="font-extrabold text-base">
									No referral recorded yet
								</h3>
								<p className="font-normal text-sm ">
									Once you have a referral, it will be displayed here.
								</p>
							</div>
						</Card>
					</>
				) : (
					<>
						<div className="pb-8 rounded-2xl">
							{isLoading ? (
								<>
									<div className="hidden md:block rounded-lg space-y-10 bg-white py-5 px-[19px] border border-[#EDEDED]">
										<TableLoader />
									</div>
									<div className="md:hidden">
										<MobileTableLoader />
									</div>
								</>
							) : (
								<>
									<div className="hidden md:block px-8 py-9 bg-white rounded-2xl relative overflow-x-auto">
										<DataTable
											tableStyles="mb-4 min-w-full"
											justifyMenueItem="justify-normal"
											tableHeadStyles="text-justify"
											tableRowItemStyles="text-justify"
											hasMenueItems
											menueItemType="icon-button"
											tHead={tableHead}
											tBody={tableBody}
											hasActions={false}
											showSearch={true}
											searchProps={{
												onSearch: handleSearch,
												onChange: (e) => setSearchKeyword(e.target.value),
												placeholder: "Search by first or last name",
												defaultValue: searchKeyword,
												className: "bg-white",
											}}
											showFilter={true}
											filterProps={{
												triggerText: "Filter",
												filterContent: (
													<DropdownMenuItem className="flex flex-col gap-y-2">
														<div></div>
													</DropdownMenuItem>
												),
												className: "bg-white",
											}}
											showPagination={true}
											paginationProps={{
												currentPage: data?.page ?? 1,
												totalPages: data?.totalPages ?? 0,
												rowsPerPage: rowsPerPage,
												totalRecord: data?.totalDocs ?? 0,
												setRowsPerPage,
												onNext: () => setCurrentPage((prev) => prev + 1),
												onPrev: () => setCurrentPage((prev) => prev - 1),
											}}
										/>
									</div>

									<div className="md:hidden rounded-2xl relative overflow-x-auto">
										<DataTableMobile
											hasActions={true}
											data={mobileData}
											showSearch={true}
											searchProps={{
												onSearch: handleSearch,
												onChange: (e) => setSearchKeyword(e.target.value),
												placeholder: "Search by first or last name",
												defaultValue: searchKeyword,
												className: "bg-white",
											}}
											showFilter={true}
											filterProps={{
												triggerText: "Filter",
												filterContent: (
													<DropdownMenuItem className="flex flex-col gap-y-2">
														<div></div>
													</DropdownMenuItem>
												),
												className: "bg-white",
											}}
										/>
										<Pagination
											currentPage={data?.page ?? 1}
											totalPages={data?.totalPages ?? 0}
											rowsPerPage={rowsPerPage}
											totalRecord={data?.totalDocs ?? 0}
											setRowsPerPage={setRowsPerPage}
											onNext={() => setCurrentPage((prev) => prev + 1)}
											onPrev={() => setCurrentPage((prev) => prev - 1)}
										/>
									</div>
								</>
							)}
						</div>
					</>
				)}
			</section>
		</div>
	);
};

ReferralsCommunity.getLayout = (page: React.ReactElement) => (
	<NestedReferralsLayout>{page}</NestedReferralsLayout>
);
export default ReferralsCommunity;
