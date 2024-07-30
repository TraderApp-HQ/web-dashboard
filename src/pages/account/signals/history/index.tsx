import SearchForm from "~/components/AccountLayout/SearchForm";
import EmptySignal from "../EmptySignal";
import clsx from "clsx";
import type { ChangeEvent } from "react";
import React, { useState } from "react";
import { json } from "@remix-run/cloudflare";
import { useLoaderData, useParams } from "@remix-run/react";
import type { SignalHistoryItem } from "~/lib/types";
import data from "../data.json";
import FilterDropdown from "~/components/AccountLayout/FilterDropdown";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import { signalsHistoryDataTableMobileSelector, signalsHistoryDataTableSelector } from "~/selectors/signals";
import Pagination from "~/components/Pagination";

export const loader = async () => {
  return json(data.signalHistory);
};

function SignalHistory() {
  const signalHistory: SignalHistoryItem[] = useLoaderData<typeof loader>();

  const { term: urlTerm } = useParams<{ term?: string }>();

  const [asset, setAsset] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchterm, setSearchTerm] = useState<string>(urlTerm ?? "");

  const onStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const onEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("asset::::::::::::::::::", asset);
    console.log("createdAt::::::::::::::::::", startDate);
    console.log("selectedDate::::::::::::::::::", endDate);
  };

  const handleSearch = () => {
    console.log("searchterm::::::::::::::::::", searchterm);
  };

  //  Paginaion configurations
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);

  // Signal data pagination
  const paginatedData = signalHistory;

  const totalRecord = paginatedData.length; // Example total rows
  const totalPages = Math.ceil(totalRecord / rowsPerPage);

  // Calculate the rows to display
  const startIndex = (currentPage - 1) * rowsPerPage;

  //===================================================================
  // paginatedSignalHistory is the data to be displayed on the current page
  const paginatedSignalHistory = paginatedData.slice(startIndex, startIndex + rowsPerPage);
  //===================================================================

  React.useEffect(() => {
    // Reset to the first page when rowsPerPage changes
    setCurrentPage(1);
  }, [rowsPerPage]);

  const { tableHead, tableBody } = signalsHistoryDataTableSelector(paginatedSignalHistory /** signalHistory **/);
  const dataMobile = signalsHistoryDataTableMobileSelector(paginatedSignalHistory /** signalHistory **/);

  return (
    <>
      <div className={clsx("flex justify-between", signalHistory.length === 0 ? "mt-0" : "")}>
        <SearchForm
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="search asset"
          placeHolder="Search for asset name, status, etc..."
          onSubmit={handleSearch}
        />
        <FilterDropdown
          value={asset}
          setValue={setAsset}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onSubmit={onSubmit}
          options={data.assets}
        />

        {/* <DropdownMenu
          className="w-[256px]"
          subClass=""
          btnClass="-ml-1.5 mt-1 mb-6 sm:mb-0 sm:mt-6 w-full sm:w-24 h-12 sm:px-1.5 py-3 bg-sky-200 bg-opacity-20 rounded-lg border"
          trigger={
            <>
              <div className="text-sky-900 text-base font-normal leading-snug">Filter</div>
              <DropdownIcon />
            </>
          }
          position="left"
        >
          <DropdownMenuItem className="flex flex-col gap-y-2">
            <Form onSubmit={onSubmit} method="post">
              <Select
                name="assets"
                label="Assets"
                options={data.assets}
                classNames={{
                  input: "cursor-pointer",
                }}
                onChange={(e) => setAsset(e.target.value)}
                selected={{ value: asset }}
              />
              <Date label="Start Date" name="startDate" value={startDate} onChange={onStartDateChange} required />
              <Date label="End Date" name="endDate" value={endDate} onChange={onEndDateChange} required />
              <Button type="submit" onClick={() => {}} fluid className="mt-2">
                Search
              </Button>
            </Form>
          </DropdownMenuItem>
        </DropdownMenu> */}
      </div>
      {signalHistory.length === 0 ? (
        <EmptySignal />
      ) : (
        <div className="pb-8 rounded-2xl">
          <h3 className="font-semibold text-base text-[#08123B]">Resent Transaction</h3>
          <div className="mt-4 mb-8">
            <div className="hidden md:block overflow-x-auto p-2 bg-white rounded-2xl relative">
              <DataTable tHead={tableHead} tBody={tableBody} hasActions={false} />
            </div>
            <div className="md:hidden">
              <DataTableMobile data={dataMobile} hasActions={false} />
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
    </>
  );
}

export default SignalHistory;
