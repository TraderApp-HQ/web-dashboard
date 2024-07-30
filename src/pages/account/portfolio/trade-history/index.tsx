import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import type { TradeHistory } from "~/lib/types";
import data from "~/data/wallet/data.json";
import EmptyTransaction from "~/components/Wallet/EmptyTransaction";
import PortfolioTabSection from "~/components/Portfolio/PortfolioTabSection";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import { tradeHistoryDataTableMobileSelector, tradeHistoryDataTableSelector } from "~/selectors/portfolio";
import React from "react";
import Pagination from "~/components/Pagination";

export const loader = async ({}: LoaderFunctionArgs) => {
  return json(data);
};

export default function () {
  const res = useLoaderData<typeof loader>();
  const items: TradeHistory[] = res.tradeHistories;

  //  Paginaion configurations
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);

  // Signal data pagination
  const paginatedData = items;

  const totalRecord = paginatedData.length; // Example total rows
  const totalPages = Math.ceil(totalRecord / rowsPerPage);

  // Calculate the rows to display
  const startIndex = (currentPage - 1) * rowsPerPage;

  //===================================================================
  // paginatedActiveSignal is the data to be displayed on the current page
  const paginatedItems = paginatedData.slice(startIndex, startIndex + rowsPerPage);
  //===================================================================

  React.useEffect(() => {
    // Reset to the first page when rowsPerPage changes
    setCurrentPage(1);
  }, [rowsPerPage]);

  const { tableHead, tableBody } = tradeHistoryDataTableSelector(paginatedItems /** items */);
  const dataMobile = tradeHistoryDataTableMobileSelector(paginatedItems /** items */);

  return (
    <div>
      <PortfolioTabSection />
      <div className="my-6">
        <h2 className="flex-none text-[#08123B] font-bold py-3">Open Trades</h2>

        {items.length === 0 ? (
          <EmptyTransaction />
        ) : (
          <div>
            <div className="mt-2 mb-8">
              <div className="hidden md:block md:overflow-hidden overflow-x-auto p-2 bg-white rounded-2xl relative">
                <DataTable hasActions={false} tHead={tableHead} tBody={tableBody} />
              </div>
              <div className="md:hidden">
                <DataTableMobile hasActions={false} data={dataMobile} />
              </div>
            </div>
            <div className="bg-white p-4 w-1/2 ml-auto">
              {/* pagination component goes here */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                totalRecord={totalRecord}
                setRowsPerPage={setRowsPerPage}
                onNext={setCurrentPage}
                onPrev={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
