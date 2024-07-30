import SearchForm from "~/components/AccountLayout/SearchForm";
import EmptySignal from "../EmptySignal";
import clsx from "clsx";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { json } from "@remix-run/cloudflare";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import type { SignalHistoryData } from "~/lib/types";
import data from "~/routes/account/signals/data.json";
import DropdownMenu, { DropdownMenuItem } from "~/components/AccountLayout/DropdownMenu";
import Button from "~/components/common/old/Button";
import DropdownIcon from "~/components/icons/DropdownIcon";
import Date from "~/components/common/Date";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import { signalsHistoryDataTableMobileSelector, signalsHistoryDataTableSelector } from "~/selectors/signal-management";
import Select from "~/components/AccountLayout/Select";

export const loader = async () => {
  return json(data.signalHistory);
};

function SignalHistory() {
  const signalHistory: SignalHistoryData = useLoaderData<typeof loader>();

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

  const { tableHead, tableBody } = signalsHistoryDataTableSelector(signalHistory);
  const dataMobile = signalsHistoryDataTableMobileSelector(signalHistory);

  return (
    <>
      <div className={clsx("flex justify-between", signalHistory.length === 0 ? "mt-0" : "")}>
        <SearchForm
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="search asset"
          placeHolder="Search for asset name, status, etc..."
          onSubmit={handleSearch}
        />

        <DropdownMenu
          className="w-[256px]"
          subClass=""
          btnClass="mt-6 w-24 h-12 px-1.5 py-3 bg-sky-200 bg-opacity-20 rounded-lg border"
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
        </DropdownMenu>
      </div>
      {signalHistory.length === 0 ? (
        <EmptySignal />
      ) : (
        <div className="pb-8 rounded-2xl">
          <h3 className="font-bold text-base text-[#08123B]">All Active Signal (2)</h3>
          <div className="mt-2 mb-8">
            <div className="hidden md:block p-10 bg-white rounded-2xl relative overflow-x-auto">
              <DataTable hasActions={false} tHead={tableHead} tBody={tableBody} />
            </div>
            <div className="md:hidden relative">
              <DataTableMobile data={dataMobile} />
            </div>
          </div>
          <div className="border w-[30%] ml-auto">pagination component goes here</div>
        </div>
      )}
    </>
  );
}

export default SignalHistory;
