import Modal from "~/components/Modal";
import ArrowDownSlim from "~/components/icons/ArrowDownSlim";
import ArrowSwap from "~/components/icons/ArrowSwap";
import CustomSelect from "../../../../components/Wallet/CustomSelect";
import data from "~/data/wallet/data.json";
import { useLoaderData } from "@remix-run/react";
import type { Asset, Wallet } from "~/lib/types";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useState } from "react";
import WalletType from "../../../../components/Wallet/WalletType";
import Button from "~/components/AccountLayout/Button";
import { useNavigate } from "react-router-dom";
import RoundedTextDiv from "~/components/AccountLayout/RoundedTextDiv";
import InputField from "~/components/common/InputField";
import { handleKeyDown } from "~/lib/utils";

export const loader = ({ request }: LoaderFunctionArgs) => {
  return json(data);
};

export default function () {
  const navigate = useNavigate();
  const data = useLoaderData<typeof loader>();

  const assets: Asset[] = data.assets;
  const wallets: Wallet[] = data.wallets;
  const [asset, setAsset] = useState(assets.filter((asset) => asset?.shortName?.toLocaleLowerCase() === "btc")[0]);
  const [fromWallet, setFromWallet] = useState(wallets.filter((wallet) => wallet?.name === "Main Wallet")[0]);
  const [toWallet, setToWallet] = useState(wallets.filter((wallet) => wallet?.name === "Trading Wallet")[0]);
  const [openModal, setOpenModal] = useState(true);

  const onAssetSelected = (asset: Asset) => {
    setAsset(asset);
  };

  const onFromWalletSelected = (wallet: Wallet) => {
    setFromWallet(wallet);
    setToWallet(wallets.filter((wallet) => wallet?.name !== wallet.name)[0]);
  };

  const onToWalletSelected = (wallet: Wallet) => {
    setToWallet(wallet);
    setFromWallet(wallets.filter((wallet) => wallet?.name !== wallet.name)[0]);
  };

  const onClose = () => {
    setOpenModal(false);
    navigate(-1);
  };

  const handleSwap = () => {
    const from = fromWallet;
    const to = toWallet;

    setToWallet(from);
    setFromWallet(to);
  };

  return (
    <>
      <Modal openModal={openModal} width="md:w-[458px]" onClose={onClose} title="Transfer">
        <div className="space-y-5 pb-7 text-left">
          <div className="w-full py-4 px-3 rounded-2xl border border-[#D1D7F0] bg-white flex-col space-y-3">
            <div className="flex justify-between text-sm">
              <h5 className="font-semibold text-[#08123B]">From</h5>
              <h5 className="self-start ml-5">{fromWallet?.name}</h5>
              <div>
                <WalletType wallets={wallets} selectedDefault={fromWallet} onSelected={onFromWalletSelected} />
              </div>
            </div>
            <div className="flex justify-between">
              <ArrowDownSlim />
              <div className="cursor-pointer" onClick={handleSwap}>
                <ArrowSwap />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <h5 className="font-semibold text-[#08123B]">To</h5>
              <h5 className="self-start ml-5">{toWallet?.name}</h5>
              <div>
                <WalletType wallets={wallets} selectedDefault={toWallet} onSelected={onToWalletSelected} />
              </div>
            </div>
          </div>
          <div className="w-full space-y-3">
            <div>
              <h5 className="wallet-form-label">Asset</h5>
              <div className="p-2 bg-[#ECF2FF]">
                <CustomSelect
                  assets={assets}
                  selectedDefault={asset}
                  onSelected={onAssetSelected}
                  selectedItemCss="bg-[#ECF2FF]"
                />
              </div>
            </div>

            <div>
              <h5 className="wallet-form-label">Amount</h5>
              <RoundedTextDiv className="py-1 px-3 items-center rounded-xl">
                <InputField
                  onKeyDown={handleKeyDown}
                  type="number"
                  placeholder="$000.00"
                  className="textbox no-spin-buttons bg-[#FFFFFF]"
                />

                <span className="text-[#08123B] text-xs mt-2">USDT</span>
              </RoundedTextDiv>
            </div>
            <div className="flex justify-between p-2 mt-1 text-xs bg-[#F2F4FA]">
              <span>&nbsp;</span>
              <div className="flex">
                <span>213344.4884 USDT</span>
                <span className="text-[#102477] font-bold ml-1">MAX</span>
              </div>
            </div>
          </div>
          <div className="wallet-modal-btn-div">
            <Button fluid>Transfer</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
