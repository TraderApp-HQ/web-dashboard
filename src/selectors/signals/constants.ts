import type { ITHead } from "~/components/common/DataTable/config";

export const ActiveSignalsTableHeadItems: ITHead[] = [
  {
    displayItem: "Asset",
    styles: "md:!text-left md:!pl-8",
  },
  {
    displayItem: "Current price",
  },
  {
    displayItem: "Change",
  },
  {
    displayItem: "Target profits",
  },
  {
    displayItem: "Created",
  },
  {
    displayItem: "Status",
  },
];

export const SignalsHistoryTableHeadItems: ITHead[] = [
  {
    displayItem: "Asset",
  },
  {
    displayItem: "Win/loss",
  },
  {
    displayItem: "Start date",
  },
  {
    displayItem: "End date",
  },
];
