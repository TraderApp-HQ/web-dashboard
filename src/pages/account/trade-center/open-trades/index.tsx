import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import { NestedTradeCenterLayout } from "..";
import { TradingAccountSummaryCard } from "~/pages/admin/trade-center/open-trades";
import { useFetchOpenTrades } from "~/hooks/useTrades";
import TableLoader from "~/components/Loaders/TableLoader";
import MobileTableLoader from "~/components/Loaders/MobileTableLoader";
import ComponentError from "~/components/Error/ComponentError";
import SignalsEmptyState from "~/components/AccountLayout/SignalsEmptyState";

const OpenTrades = () => {
	const {
		error,
		isError,
		isLoading,
		isSuccess,
		tradesTableBody,
		tradesTableHead,
		mobileTableData,
		trades,
		tradesAggregate,
	} = useFetchOpenTrades({ isAdmin: false });
	const openTradesCount = trades && trades.length > 0 && trades.length;

	return (
		<div>
			{isLoading ? (
				<>
					<div className="hidden md:block">
						<TableLoader />
					</div>
					<div className="md:hidden">
						<MobileTableLoader />
					</div>
				</>
			) : !isLoading && isError ? (
				<section className="pb-3 rounded-2xl">
					<ComponentError errorMessage={error?.message} />
				</section>
			) : !isLoading && trades && trades.length === 0 ? (
				<SignalsEmptyState message="Trade" />
			) : (
				<div>
					{tradesAggregate && (
						<TradingAccountSummaryCard
							isLoading={isLoading}
							isSuccess={isSuccess}
							isError={isError}
							totalBalanceStyle="text-4xl"
							cardStyle="p-4 md:px-5 md:py-8 !rounded-2xl mb-10"
							tradesAggregate={tradesAggregate}
						/>
					)}
					<div className="pt-2 pb-8">
						<h2 className="text-slate-900 font-bold text-base mb-2">
							Open Trades ({openTradesCount})
						</h2>

						<div className="rounded-2xl bg-[#F3F4F6]">
							<div className="hidden xl:block overflow-x-auto">
								{isSuccess && tradesTableBody && (
									<DataTable
										tHead={tradesTableHead}
										tBody={tradesTableBody}
										tableStyles="bg-white px-10"
										tableHeadStyles="bg-[#F3F4F6]"
										tableHeadItemStyles="text-center"
									/>
								)}
							</div>
							<div className="xl:hidden relative">
								{isSuccess && <DataTableMobile data={mobileTableData} />}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

OpenTrades.getLayout = (page: React.ReactElement) => (
	<NestedTradeCenterLayout>{page}</NestedTradeCenterLayout>
);
export default OpenTrades;
