import type { FC } from "react";
import React from "react";
import type { ITableMobile } from "./config";
import { ITHead } from "./config";
import TableMenuDropdown from "./TableMenuDropdown";

interface IDataTableMobile {
  data: ITableMobile[];
  hasActions?: boolean;
}

const DataTableMobile: FC<IDataTableMobile> = ({ data, hasActions }) => {
  return (
    <>
      {data.map((dataItem, index) => (
        <div className="border rounded-lg p-2 bg-white mb-6" key={index}>
          <div className="flex items-center justify-between mb-6">
            <div className={`${dataItem.tHead.styles ?? ""}`}>{dataItem.tHead.displayItemTitle}</div>
            {hasActions && (
              <div>
                <TableMenuDropdown dataTableMenuItems={dataItem.actions ?? []} />
              </div>
            )}
          </div>
          {dataItem.tBody.map((tb, index) => (
            <div
              key={index}
              className={`flex justify-between items-center ${
                index < dataItem.tBody.length - 1 ? "border-b mb-6" : ""
              } border-[#E5E7EB] border-opacity-20 pb-3 py-2 ${tb.styles ?? ""}`}
            >
              <div className="text-sm text-[#9CA3AF] w-[40%]">{tb.displayItemTitle}</div>
              <div className="mr-4 text-base text-[#0C394B] font-semibold w-[60%] text-right">
                {tb.displayItemValue}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

DataTableMobile.defaultProps = {
  hasActions: true,
};

export default DataTableMobile;
