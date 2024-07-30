import { Form, Outlet, useLoaderData, useParams } from "@remix-run/react";
import SearchForm from "~/components/AccountLayout/SearchForm";
import EmptySignal from "../EmptySignal";
import DropdownMenu, { DropdownMenuItem } from "~/components/AccountLayout/DropdownMenu";
import clsx from "clsx";
import DropdownIcon from "~/components/icons/DropdownIcon";
import Date from "~/components/common/Date";
import Button from "~/components/common/old/Button";
import { json } from "@remix-run/cloudflare";
import type { ChangeEvent } from "react";
import { useState } from "react";
import data from "~/routes/account/signals/data.json";
import type SignalsData from "~/lib/types";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import Card from "~/components/AccountLayout/Card";
import DeleteModal from "~/components/Modal/DeleteModal";
import TopArrowFilledIcon from "~/components/icons/TopArrowFilledIcon";
import IconButton from "~/components/AccountLayout/IconButton";
import Select from "~/components/AccountLayout/Select";
import { useFetchActiveSignals } from "~/apis/handlers/signals/hooks";
import { ISignal } from "~/apis/handlers/signals/interfaces";
import { activeSignalsPerfomanceSumary } from "~/selectors/signals";
import PerformanceSummaryCard from "~/components/Cards/PerfomanceSummaryCard";

export const loader = async () => {
  return json(data);
};

function ActiveSignal() {
  const signalResult: SignalsData = useLoaderData<typeof loader>();
  const { signals } = signalResult;

  const { term: urlTerm } = useParams<{ term?: string }>();

  const [asset, setAsset] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [searchterm, setSearchTerm] = useState<string>(urlTerm ?? "");
  const [toggleDeleteModal, setToggleDeleteModal] = useState(false);
  const [isToggle, setToggle] = useState(false);

  const { isLoading, isSuccess, activeSignals, signalsTableHead, signalsTableBody, signalsMobileTableBody } =
    useFetchActiveSignals();

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("asset::::::::::::::::::", asset);
    console.log("createdAt::::::::::::::::::", createdAt);
    console.log("selectedDate::::::::::::::::::", selectedDate);
    console.log("time::::::::::::::::::", time);
  };

  const handleSearch = async () => {
    console.log("searchterm::::::::::::::::::", searchterm);
  };

  const handleDeleteModalClose = () => {
    setToggleDeleteModal(false);
  };

  const handleDeleteModalConfirm = () => {
    // do something or initiate delete
    handleDeleteModalClose();
  };

  return (
    <>
      <ActiveSignalCard signals={activeSignals} />
      <div className={clsx("flex justify-between", signals.signals.length === 0 ? "mt-0" : "")}>
        <SearchForm
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="search asset"
          placeHolder="Search for asset name, status, etc..."
          onSubmit={handleSearch}
        />

        <DropdownMenu
          className="w-[256px]"
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
            </Form>
          </DropdownMenuItem>
        </DropdownMenu>
      </div>

      {signals.signals.length === 0 ? (
        <EmptySignal />
      ) : (
        <div className="pb-8 rounded-2xl">
          <h3 className="font-bold text-base text-[#08123B]">All Active Signal (10)</h3>
          <div className="mt-2 mb-8">
            <div className="hidden md:block p-10 bg-white rounded-2xl relative overflow-x-auto">
              {isLoading && <div>Loading...</div>}
              {isSuccess && signalsTableBody && <DataTable tHead={signalsTableHead} tBody={signalsTableBody} />}
            </div>
            <div className="md:hidden relative">
              {isLoading && <div>Loading...</div>}
              {isSuccess && <DataTableMobile data={signalsMobileTableBody} />}
            </div>
          </div>
          <div className="border w-[30%] ml-auto">pagination component goes here</div>
        </div>
      )}

      <DeleteModal
        title={"Delete signal"}
        description={"Are you sure you want to delete this signal"}
        btnConfirm={handleDeleteModalConfirm}
        btnCancle={handleDeleteModalClose}
        openModal={toggleDeleteModal}
        onClose={handleDeleteModalClose}
      />
      <Outlet />
    </>
  );
}

const ActiveSignalCard: React.FC<{ signals: ISignal[] }> = ({ signals }) => {
  const signalPerformer = activeSignalsPerfomanceSumary(signals);
  return (
    signals.length > 0 && (
      <div className="flex flex-col md:flex-row gap-2">
        {signalPerformer.map((performance) => (
          <PerformanceSummaryCard key={performance.id} data={performance} />
        ))}
      </div>
    )
  );
};

// interface ActiveSignalCardProps {
//   signals: SignalsData;
// }

// function ActiveSignalCard({ signals }: ActiveSignalCardProps) {
//   return (
//     signals.signals.signals.length > 0 && (
//       <Card className="w-12/12 lg:w-8/12 2xl:w-7/12">
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           <div className="flex-col justify-center items-start gap-0.5 py-3">
//             <h3 className="text-neutral-700 text-sm font-normal leading-tight">Total Active signal</h3>
//             <div className="justify-center items-center gap-9 inline-flex">
//               <p className="text-neutral-700 text-base font-bold">{signals.signals.totalActiveSignal}</p>
//             </div>
//           </div>

//           <div className="py-3">
//             <div className="w-12 h-px origin-top-left rotate-90 border border-stone-300 border-opacity-20 sm:block hidden" />
//             <div className="flex-col justify-center items-start gap-0.5 ml-3">
//               <h3 className="text-neutral-700 text-sm font-normal leading-tight">Total Capital</h3>
//               <div className="justify-center items-center gap-9 inline-flex">
//                 <p className="text-neutral-700 text-base font-bold">{signals.signals.totalCapital}.00 USD</p>
//               </div>
//             </div>
//           </div>

//           <div className="py-3">
//             <div className="w-80 h-px border border-stone-300 border-opacity-20 mb-4 sm:hidden block" />
//             <div className="w-12 h-px origin-top-left rotate-90 border border-stone-300 border-opacity-20 sm:block hidden" />
//             <div className="flex-col justify-center items-start gap-2 ml-0 sm:ml-3">
//               <h3 className="text-neutral-700 text-sm font-semibold leading-tight">Best performer</h3>
//               <div className="justify-start items-center gap-12 inline-flex">
//                 <div className="justify-start items-center gap-2 flex">
//                   <img
//                     src={signals.signals.bestSignal.image}
//                     alt={signals.signals.bestSignal.name}
//                     className="w-6 h-6 relative"
//                   />
//                   <p className="text-slate-900 text-xs font-semibold leading-none">{signals.signals.bestSignal.name}</p>
//                 </div>
//                 <div className="justify-start items-center flex">
//                   <div className="w-4 h-4 relative origin-top-left -rotate-180" />
//                   <p className="flex text-emerald-700 text-sm font-normal">
//                     <IconButton
//                       Icon={TopArrowFilledIcon}
//                       onClick={() => {}}
//                       aria-label="more page"
//                       disabled={false}
//                     ></IconButton>
//                     {signals.signals.percentage}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card>
//     )
//   );
// }

export default ActiveSignal;
