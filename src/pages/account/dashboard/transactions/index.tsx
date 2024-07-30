import { useRouter } from "next/router";
import clsx from "clsx";
import type { ChangeEvent } from "react";
import { useState } from "react";
import Date from "~/components/AccountLayout/Date";
import Button from "~/components/AccountLayout/Button";
import DropdownMenu, { DropdownMenuItem } from "~/components/AccountLayout/DropdownMenu";
import SearchForm from "~/components/AccountLayout/SearchForm";
import Select from "~/components/AccountLayout/Select";
import DropdownIcon from "~/components/icons/DropdownIcon";
import LeftArrowIcon from "~/components/icons/LeftArrowIcon";
import data from "~/data/wallet/data.json";
import RecentTransactions from "~/components/Wallet/RecentTransactions";
import IconButton from "~/components/AccountLayout/IconButton";
import { ROUTES } from "~/config/constants";

export default function () {
  const router = useRouter();
  // const { term: urlTerm } = useParams<{ term?: string }>();

  const [asset, setAsset] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  // const [searchterm, setSearchTerm] = useState<string>(urlTerm ?? "");

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleSearch = async () => {
    console.log("searchterm::::::::::::::::::");
  };

  return (
    <>
      <IconButton onClick={() => router.push(ROUTES.dashboard.backButton)} Icon={LeftArrowIcon} aria-label="back button">
        <span className="ml-4 text-base text-[#08123B] font-semibold">All Transactions</span>
      </IconButton>
      <div className={clsx("flex justify-between")}>
        <SearchForm
          onChange={(e) => {}}
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
            <form onSubmit={onSubmit} method="post">
              <Select
                name="assets"
                label="Assets"
                options={data.trans.assets}
                classNames={{
                  input: "cursor-pointer",
                }}
                onChange={(e) => setAsset(e.target.value)}
                selected={{ value: asset }}
              />
              <Select
                name="createdAt"
                label="CreatedAt"
                options={data.createdAtList}
                classNames={{
                  input: "cursor-pointer",
                }}
                onChange={(e) => setCreatedAt(e.target.value)}
                selected={{ value: createdAt }}
              />
              <Date label="Date" name="selectedDate" value={selectedDate} onChange={handleDateChange} required />

              <Select
                name="time"
                label="Time"
                options={data.timeList}
                classNames={{
                  input: "cursor-pointer",
                }}
                onChange={(e) => setTime(e.target.value)}
                selected={{ value: time }}
              />
              <Button type="submit" onClick={() => {}} fluid className="mt-2">
                Search
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
      <RecentTransactions />
    </>
  );
}
