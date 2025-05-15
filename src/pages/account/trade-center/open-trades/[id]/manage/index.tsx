import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Modal from "~/components/Modal";
import { getTrade } from "~/lib/utils";
import data from "~/data/wallet/data.json";
import type { OpenTrade } from "~/lib/types";
import Button from "~/components/AccountLayout/Button";
import { NestedTradeCenterLayout } from "../../..";

const ManageTrade = () => {
	const [openModal, setOpenModal] = useState(true);

	const router = useRouter();
	const id = router.query.id as string;
	const [trade, setTrade] = useState<OpenTrade>();

	useEffect(() => {
		async function fetchData() {
			const resObj = await getTrade("1", data.openTrades);
			setTrade(resObj);
		}
		fetchData();
	}, [id]);

	const onClose = () => {
		setOpenModal(false);
		router.back();
	};

	return (
		<>
			<Modal
				openModal={openModal}
				width="lg:w-[807px]"
				onClose={onClose}
				title="Manage Trade"
			>
				<div className="space-y-7">
					<div className="bg-[#F8F9FC] p-4">
						<div className="flex justify-between p-3">
							<h3 className="text-[#414141] text-sm">Symbol</h3>
							<h2 className="text-[#808080] text-base">{trade?.asset?.shortName}</h2>
						</div>
						<div className="flex justify-between p-3">
							<h3 className="text-[#414141] text-sm">Entry Price (USDT)</h3>
							<h2 className="text-[#808080] text-base">{trade?.entryPrice}</h2>
						</div>
						<div className="flex justify-between p-3">
							<h3 className="text-[#414141] text-sm">Market Price(USDT)</h3>
							<h2 className="text-[#808080] text-base">{trade?.price}</h2>
						</div>
					</div>
					<div>
						<h3 className="text-[#000000] text-sm font-medium">Amount</h3>
						<div className="flex justify-between p-3 bg-[#F8F9FC] text-[#08123B] text-base">
							<h3 className="font-semibold">30% (203.000.9000)</h3>
							<h2 className="font-semibold">USDT</h2>
						</div>
					</div>
					<div className="grid-cols-4 grid gap-3 md:w-4/5">
						<div className="w-full text-center">
							<p className="bg-[#1836B2] rounded-lg h-[10px] w-full"></p>
							<h3 className="text-[#1836B2] text-sm">25%</h3>
						</div>
						<div className="w-full text-center">
							<p className="bg-[#D9D9D9] rounded-lg h-[10px] w-full"></p>
							<h3 className="text-[#000000] text-sm">50%</h3>
						</div>
						<div className="w-full text-center">
							<p className="bg-[#D9D9D9] rounded-lg h-[10px] w-full"></p>
							<h3 className="text-[#000000] text-sm">75%</h3>
						</div>
						<div className="w-full text-center">
							<p className="bg-[#D9D9D9] rounded-lg h-[10px] w-full"></p>
							<h3 className="text-[#000000] text-sm">100%</h3>
						</div>
					</div>

					<div className="bg-[#F8F9FC] p-4">
						<div className="flex justify-between p-3">
							<h3 className="text-[#414141] text-sm">Position Amount</h3>
							<h2 className="text-[#808080] text-base">{trade?.positionAmount}</h2>
						</div>
						<div className="flex justify-between p-3">
							<h3 className="text-[#414141] text-sm">Estimated price</h3>
							<h2 className="text-[#808080] text-base">{trade?.estimatedAmount}</h2>
						</div>
					</div>
					<div className="wallet-modal-btn-div">
						<Button fluid>Confirm</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

ManageTrade.getLayout = (page: React.ReactElement) => (
	<NestedTradeCenterLayout>{page}</NestedTradeCenterLayout>
);
export default ManageTrade;
