import Card from "~/components/AccountLayout/Card";
import EyesIcon from "~/components/icons/EyesIcon";
import type { JSXElementConstructor } from "react";
import { useState } from "react";
import data from "~/data/wallet/data.json";
import HidenBalance from "../HidenBalance";
import type { IconProps } from "~/components/AccountLayout/IconButton";
import IconButton from "~/components/AccountLayout/IconButton";
import { useRouter } from "next/router";
import OpenEyesIcon from "~/components/icons/OpenEyesIcon";

export interface ITotalBalanceItems {
  label: string;
  url: string;
  Icon: JSXElementConstructor<IconProps>;
}
interface ITotalBalanceSectionProps {
  supportedOperations: ITotalBalanceItems[];
  showBalanceText?: string;
  btcBalance?: string;
  totalBalanceStyle?: string;
  padding?: string;
}

export default function WalletBalanceCard({
  supportedOperations,
  showBalanceText = "Total Balance",
  // btcBalance,
  totalBalanceStyle,
  padding,
}: ITotalBalanceSectionProps) {
  const router = useRouter();
  const [showBalance, handleShowBalance] = useState(true);

  return (
    <>
      <Card className={`md:flex md:justify-between ${padding ? padding : "p-5"}`}>
        <div>
          <div>
            <IconButton
              reversed
              Icon={showBalance ? EyesIcon : OpenEyesIcon}
              btnClass="font-bold text-base gap-2"
              onClick={() => handleShowBalance(!showBalance)}
              disabled={false}
            >
              {showBalanceText}
            </IconButton>
            <div className="flex flex-col space-y-1.5 ml-1">
              <h3 className={`font-bold ${totalBalanceStyle ? totalBalanceStyle : "text-xl "}`}>
                {showBalance ? `${data?.wallet?.totalBalance} USD` : <HidenBalance className="mt-6 mb-2" />}
              </h3>
              <h3 className="text-base font-bold text-[#585858]">=${data?.wallet?.totalBalance}</h3>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:flex gap-px md:gap-2 mb-2 sm:mb-0 flex-wrap md:justify-between md:space-x-2 h-[4rem] py-4 text-xs md:-mt-5">
          {supportedOperations.map((item, index) => (
            <IconButton
              key={index}
              Icon={item.Icon}
              btnClass="bg-stone-50 px-4 text-zinc-500 gap-2 m-1"
              onClick={() => router.push(item.url)}
              disabled={false}
            >
              {item.label}
            </IconButton>
          ))}
        </div>
      </Card>
    </>
  );
}
