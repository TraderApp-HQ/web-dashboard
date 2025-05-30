import { useRouter } from "next/router";
import { NestedRewardHubLayout } from "..";
import { FaUsers } from "react-icons/fa";
import { DropdownMenuItem } from "~/components/AccountLayout/DropdownMenu";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import ConnectionsIcons from "~/components/icons/ConnectionsIcons";
import CurrencySymbolsIcon from "~/components/icons/CurrencySymbolsIcon";
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
import ComponentError from "~/components/Error/ComponentError";

const ReferralsCommunity = () => {
	const router = useRouter();

	const { data: stats, isLoading: isStatsLoading, isError: isStatsError } = useReferralOverview();
	const searchKeywordInitial = Array.isArray(router.query.query)
		? router.query.query[0]
		: router.query.query || "";
	const params = new URLSearchParams();

	const [searchKeyword, setSearchKeyword] = useState(searchKeywordInitial);
	const [currentPage, setCurrentPage] = useState(Number(router.query.page) || 1);
	const [rowsPerPage, setRowsPerPage] = useState(Number(router.query.rows) || 10);

	const { data, refetch, isLoading, isSuccess, isError } = useReferrals({
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

	const handleRowsPerPageChange = (newRowsPerPage: number) => {
		setRowsPerPage((prevRowsPerPage) => {
			const currentItemOffset = (currentPage - 1) * prevRowsPerPage;
			const adjustedPageNumber = Math.floor(currentItemOffset / newRowsPerPage) + 1;
			setCurrentPage(adjustedPageNumber);
			return newRowsPerPage;
		});
	};

	const referrals = isSuccess ? data.docs : [];
	const { tableHead, tableBody } = communityUsersDataTableSelector(referrals);
	const mobileData = communityUsersMobileDataTableSelector(referrals);

	const paginationProps = {
		currentPage: data?.page ?? currentPage,
		totalPages: data?.totalPages ?? 0,
		rowsPerPage: data?.limit ?? rowsPerPage,
		totalRecord: data?.totalDocs ?? 0,
		hasNextPage: data?.hasNextPage ?? null,
		hasPrevPage: data?.hasPrevPage ?? null,
		setRowsPerPage: handleRowsPerPageChange,
		onNext: () => setCurrentPage((prev) => prev + 1),
		onPrev: () => setCurrentPage((prev) => prev - 1),
	};

	return (
		<section className="space-y-10">
			{isStatsLoading ? (
				<ReferralCommunityCardLoader />
			) : !isStatsLoading && isStatsError ? (
				<ComponentError />
			) : (
				!isStatsLoading &&
				!isStatsError &&
				stats && (
					<section className="flex flex-col md:flex-row gap-2">
						<ReferalCard
							title="Community Members"
							subtext={`${stats.communitySize}`}
							Icon={() => <FaUsers color="#102477" size={"24"} />}
						/>
						<ReferalCard
							title="Community ATC"
							subtext={`$ ${stats.communityATC.toFixed(2)}`}
							Icon={CurrencySymbolsIcon}
						/>
						<ReferalCard
							title="Referral Tree Levels"
							subtext={`${stats.referralTreeLevels}`}
							Icon={ConnectionsIcons}
						/>
					</section>
				)
			)}

			<section className="pb-8 rounded-2xl">
				{isLoading ? (
					///////////////////// Loader Component ///////////////
					<>
						<section className="hidden md:block rounded-lg space-y-10 bg-white py-5 px-[19px] border border-[#EDEDED]">
							<TableLoader />
						</section>
						<section className="md:hidden">
							<MobileTableLoader />
						</section>
					</>
				) : !isLoading && isError ? (
					////////////////////// Error Component ////////////////////
					<ComponentError />
				) : !isLoading && !isError && referrals.length === 0 ? (
					//////////////////// No Referral Component /////////////////
					<Card className="flex flex-col justify-center items-center h-[330px]">
						<NoTransactionIcon />
						<section className="text-[#414141] text-center mt-4">
							<h3 className="font-extrabold text-base">No referral recorded yet</h3>
							<p className="font-normal text-sm ">
								Once you have a referral, it will be displayed here.
							</p>
						</section>
					</Card>
				) : (
					///////////////// Referral Table /////////////////////
					!isLoading &&
					!isError &&
					referrals.length >= 1 && (
						<>
							<section className="hidden md:block px-8 py-9 bg-white rounded-2xl relative overflow-x-auto">
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
												<section></section>
											</DropdownMenuItem>
										),
										className: "bg-white",
									}}
									showPagination={true}
									paginationProps={paginationProps}
								/>
							</section>

							<section className="md:hidden relative overflow-x-auto">
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
												<section></section>
											</DropdownMenuItem>
										),
										className: "bg-white",
									}}
									showPagination={true}
									paginationProps={paginationProps}
								/>
							</section>
						</>
					)
				)}
			</section>
		</section>
	);
};

ReferralsCommunity.getLayout = (page: React.ReactElement) => (
	<NestedRewardHubLayout>{page}</NestedRewardHubLayout>
);
export default ReferralsCommunity;
