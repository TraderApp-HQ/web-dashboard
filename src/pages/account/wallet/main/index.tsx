import { json } from "@remix-run/cloudflare";
import data from "~/data/wallet/data.json";
import WalletBalanceCard from "~/components/Wallet/WalletBalanceCard";
import WalletTabSection from "~/components/Wallet/WalletTabSection";
import DepositIcon from "~/components/icons/DepositIcon";
import TransferIcon from "~/components/icons/TransferIcon";
import WithdrawIcon from "~/components/icons/WithdrawIcon";
import ConvertIcon from "~/components/icons/ConvertIcon";
import { ROUTES } from "~/config/constants";
import Currencies from "~/components/Wallet/Currencies";
import RecentTransactions from "~/components/Wallet/RecentTransactions";

export const loader = async () => {
  return json(data);
};

const WalletTab = () => {
  const supportedOperations = [
    {
      label: "Deposit",
      url: ROUTES.wallet.deposit,
      Icon: DepositIcon,
    },
    {
      label: "Withdraw",
      url: ROUTES.wallet.withdraw,
      Icon: WithdrawIcon,
    },
    {
      label: "Transfer",
      url: ROUTES.wallet.transfer,
      Icon: TransferIcon,
    },
    {
      label: "Convert",
      url: ROUTES.wallet.convert,
      Icon: ConvertIcon,
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
};

export default WalletTab;
