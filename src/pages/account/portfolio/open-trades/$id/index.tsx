import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import type { OpenTrade, Orders } from "~/lib/types";
import data from "~/data/wallet/data.json";
import EmptyTransaction from "~/components/Wallet/EmptyTransaction";
import { getTrade } from "~/lib/utils";
import Card from "~/components/AccountLayout/Card";
import Button from "~/components/AccountLayout/Button";
import LeftArrowIcon from "~/components/icons/LeftArrowIcon";
import IconButton from "~/components/AccountLayout/IconButton";
import { ROUTES } from "~/config/constants";
import OverlayContainer from "~/components/AccountLayout/OverlayContainer";
import { useNavigate } from "react-router-dom";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import { orderDataTableMobileSelector, orderDataTableSelector } from "~/selectors/portfolio";
import WalletBalanceCard from "~/components/Wallet/WalletBalanceCard";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  const trade = await getTrade(id, data.openTrades);
  return json({ data: data, trade: trade });
};

export default function () {
  const res = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <OverlayContainer subClass="bg-blue-50" className="md:left-[16%] left-0 pr-0 md:pr-[16%]">
      <IconButton
        onClick={() => navigate(ROUTES.portfolio.backButton)}
        btnClass="mb-6"
        Icon={LeftArrowIcon}
        aria-label="back button"
      >
        <span className="ml-4 text-2xl font-semibold bg-blu">Back</span>
      </IconButton>
      <TradeDetails trade={res.trade} />
      <OrdersOverview orders={res.data.orders} />
      <Outlet />
    </OverlayContainer>
  );
}

const TradeDetails: React.FC<{ trade: OpenTrade }> = ({ trade }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between mb-9">
        <div className="flex items-center space-x-3">
          <img src={trade?.asset?.image} alt={trade?.asset?.name} width={"30px"} height={"30px"} />
          <div>
            <h3 className="text-[#1E1E1E] text-base font-semibold"> {trade?.asset?.name}</h3>
            <h4> {trade?.asset?.shortName}</h4>
          </div>
        </div>
        <Button onClick={() => navigate(ROUTES.portfolio.manageTrade)}>Manage Trade</Button>
      </div>
      <WalletBalanceCard
        padding="-2.5"
        showBalanceText="Holdings"
        btcBalance={data.wallet.totalBalance}
        totalBalanceStyle="text-3xl"
        supportedOperations={[]}
      />
      <TradeInfoPanel trade={trade} />
    </div>
  );
};

const TradeInfoPanel: React.FC<{ trade: OpenTrade }> = ({ trade }) => {
  return (
    data && (
      <Card className="mt-7 md:w-3/5 px-3">
        <div className="grid-cols-2 grid-rows-2 lg:flex lg:justify-between">
          <div className="justify-center items-start gap-0.5 py-3">
            <h3 className="text-neutral-700 text-sm font-normal leading-tight">Price</h3>
            <p className="text-neutral-700 text-base">{trade?.price}</p>
          </div>

          <div className="flex-col justify-center items-start gap-0.5 py-3">
            <h3 className="text-neutral-700 text-sm font-normal leading-tight">Avg. buy price</h3>
            <p className="text-neutral-700 text-base">{trade?.avgBuy}.00 USD</p>
          </div>

          <div className="flex-col justify-center items-start gap-0.5 py-3">
            <h3 className="text-neutral-700 text-sm font-normal leading-tight">Total profit / loss</h3>
            <p className="text-[#04724D] text-base font-normal">
              {trade?.percent}({trade?.profitLoss})
            </p>
          </div>

          <div className="flex-col justify-center items-start gap-0.5 py-3">
            <h3 className="text-neutral-700 text-sm font-normal leading-tight">Date</h3>
            <p className="text-neutral-700 text-base">{trade?.date}</p>
          </div>
        </div>
      </Card>
    )
  );
};

const OrdersOverview: React.FC<{ orders: Orders[] }> = ({ orders }) => {
  const { tableHead, tableBody } = orderDataTableSelector(orders);
  const dataMobile = orderDataTableMobileSelector(orders);

  return (
    <div>
      {orders && orders.length === 0 ? (
        <EmptyTransaction />
      ) : (
        <div className="mt-2 mb-80 pt-2">
          <div className="flex justify-between my-3">
            <h2 className="text-[#08123B] text-base font-bold">Order</h2>
            <h2 className="text-blue-800 text-xs font-bold py-1 cursor-pointer">See more</h2>
          </div>
          <div className="hidden md:block md:overflow-hidden overflow-x-auto p-2 bg-white rounded-2xl relative">
            <DataTable hasActions={false} tHead={tableHead} tBody={tableBody} />
          </div>
          <div className="md:hidden">
            <DataTableMobile hasActions={false} data={dataMobile} />
          </div>
        </div>
      )}
    </div>
  );
};
