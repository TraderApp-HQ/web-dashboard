import data from "~/data/wallet/data.json";
import WalletBalanceCard from "~/components/Wallet/WalletBalanceCard";
import WalletTabSection from "~/components/Wallet/WalletTabSection";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import RecentTransactions from "~/components/Wallet/RecentTransactions";
import Currencies from "~/components/Wallet/Currencies";
import TransferIcon from "~/components/icons/TransferIcon";
import { ROUTES } from "~/config/constants";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json(data);
};

function Currency() {
  useLoaderData<typeof loader>();

  const supportedOperations = [
    {
      label: "Transfer",
      url: ROUTES.wallet.transfer,
      Icon: TransferIcon,
    },
  ];

  return (
    <>
      <WalletTabSection />
      <WalletBalanceCard supportedOperations={supportedOperations} />
      <Currencies />
      <RecentTransactions />
    </>
  );
}

export default Currency;
