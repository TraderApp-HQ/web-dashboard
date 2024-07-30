import { useState } from "react";
import Modal from "~/components/Modal";
import CopyIcon from "~/components/icons/CopyIcon";
import QRCode from "~/components/Wallet/qrcode.png";
import CustomSelect from "../../../../components/Wallet/CustomSelect";
import data from "~/data/wallet/data.json";
import { useLoaderData } from "@remix-run/react";
import type { Asset } from "~/lib/types";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import Button from "~/components/AccountLayout/Button";
import { useNavigate } from "react-router-dom";

export const loader = ({ request }: LoaderFunctionArgs) => {
  return json(data);
};

export default function () {
  const navigate = useNavigate();

  const data = useLoaderData<typeof loader>();

  const assets: Asset[] = data.assets;
  const [fromAsset, setFromAsset] = useState(
    assets.filter((asset) => asset?.shortName?.toLocaleLowerCase() === "btc")[0],
  );
  const [toAsset, setToAsset] = useState(assets.filter((asset) => asset?.shortName?.toLocaleLowerCase() === "usdt")[0]);
  const [openModal, setOpenModal] = useState(true);

  const onFromAssetSelected = (asset: Asset) => {
    setFromAsset(asset);
  };
  const onToAssetSelected = (asset: Asset) => {
    setToAsset(asset);
  };

  const handleMeClose = () => {
    setOpenModal(false);
    navigate(-1);
  };

  return (
    <>
      <Modal openModal={openModal} width="md:w-[807px]" onClose={handleMeClose} title="Deposit Crypto">
        <div className="space-y-5 text-left">
          <div className="w-full py-4 px-4 rounded-2xl bg-[#F4F5FA] flex-col space-y-5">
            <div>
              <label className="wallet-form-label">Select Coin</label>
              <CustomSelect
                assets={assets}
                selectedDefault={fromAsset}
                onSelected={onFromAssetSelected}
                selectedItemCss="bg-white h-16 rounded-xl px-3"
              />
            </div>

            <div>
              <label className="wallet-form-label">Network</label>
              <CustomSelect
                assets={assets}
                selectedDefault={toAsset}
                onSelected={onToAssetSelected}
                selectedItemCss="bg-white h-16 rounded-xl px-3"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">Address</h3>
            <div className="flex justify-between mt-2">
              <span className="text-[#08123B] text-base font-semibold">WETYRJLPP:LLOOOOOUYJJJK</span>
              <div className="-mt-1 cursor-pointer">
                <CopyIcon />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-5">
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-[#414141] text-sm font-bold">Expected arrival</h3>
                <h3 className="text-[#808080]">1 network confirmation</h3>
              </div>

              <div className="space-y-1">
                <h3 className="text-[#414141] text-sm font-bold">Selected Wallet</h3>
                <h3 className="text-[#808080]">Main Wallet</h3>
              </div>

              <div className="space-y-1">
                <h3 className="text-[#414141] text-sm font-bold">Contracting Address</h3>
                <h3 className="text-[#808080]">Ending in ererrttt3333333</h3>
              </div>

              <h3 className="text-[#414141] text-sm font-bold pt-6">Send only USDT to this deposit address.</h3>
              <h3 className="text-[#414141] text-sm font-bold">
                Ensure the network is <span className="text-[#E02D3C]">TRON (TRC20)</span>
              </h3>
            </div>
            <img src={QRCode} className="self-start" />
          </div>

          <div className="wallet-modal-btn-div">
            <Button fluid>Deposit</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
