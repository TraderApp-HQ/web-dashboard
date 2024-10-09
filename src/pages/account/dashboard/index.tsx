import { useCallback, useState } from "react";
import Card from "~/components/AccountLayout/Card";
import Table, {
	THead,
	THeadData,
	TBody,
	TBodyRow,
	TBodyData,
} from "~/components/AccountLayout/Table";
import HidenBalance from "~/components/Wallet/HidenBalance";
import DottedIcon from "~/components/icons/DottedIcon";
import EyesIcon from "~/components/icons/EyesIcon";
import data from "~/data/wallet/data.json";
import IconButton from "~/components/AccountLayout/IconButton";
import DepositIcon from "~/components/icons/DepositIcon";
import { useRouter } from "next/router";
import WithdrawIcon from "~/components/icons/WithdrawIcon";
import { ROUTES } from "~/config/constants";
import { useFetch } from "~/hooks/useFetch";
import { UsersService } from "~/apis/handlers/users";
import { UsersQueryId } from "~/apis/handlers/users/constants";
import { Line } from "~/components/Loaders";
import Link from "next/link";
import AccountLayout from "~/components/AccountLayout/Layout";
import Image from "next/image";
import MessageIcon from "~/components/icons/messageIcon";
import Chart from "~/components/Portfolio/Chart";

const Dashbaord = () => {
	const router = useRouter();
	const transactionsResult = data;
	const signals = transactionsResult.signals;
	const [showBalance, handleShowBalance] = useState(true);

	const supportedOperations = [
		{
			label: "Deposit",
			url: ROUTES.wallet.deposit,
			icon: DepositIcon,
		},
		{
			label: "Withdraw",
			url: ROUTES.wallet.withdraw,
			icon: WithdrawIcon,
		},
	];

	const usersService = new UsersService();
	const fetchUser = useCallback(() => usersService.getUser(), [usersService]);
	const {
		data: userProfile,
		error,
		isLoading,
	} = useFetch({
		queryKey: [UsersQueryId.userProfile],
		queryFn: fetchUser,
	});

	return (
		<div>
			<Card className="flex p-5 justify-between mb-5 items-center">
				<div className="flex-col justify-center w-full">
					{/* {isLoading && <div>Loading...</div>} */}
					{isLoading && (
						<div className="space-y-1 mb-2">
							<Line width="md" height="lg" />
							<Line width="lg" height="sm" />
						</div>
					)}
					{error && <div className="text-danger">{error.message}</div>}
					{userProfile && (
						<div className="pb-5">
							<h3 className="text-[#102477] font-bold text-[32px]">
								Hello {userProfile.firstName} !
							</h3>
						</div>
					)}
					<div
						className="flex justify-start space-x-2"
						onClick={() => handleShowBalance(!showBalance)}
					>
						<h4 className="text-sm text-[#08123B] font-medium">Wallet Overview</h4>
						<EyesIcon />
					</div>
					<h3 className="mt-1 text-xl font-bold">
						{isLoading ? (
							<Line width="md" height="lg" />
						) : showBalance ? (
							`${data?.wallet?.totalBalance} USD`
						) : (
							<HidenBalance className="mt-6 mb-2" />
						)}
					</h3>
					<div className="flex flex-col md:flex-row flex-wrap max-sm:gap-4 md:flex-nowrap md:space-x-2 py-4 text-xs">
						{supportedOperations.map((item, index) => (
							<IconButton
								key={index}
								Icon={item.icon}
								btnClass="bg-stone-50 px-4 text-zinc-500 gap-2 flex justify-center"
								onClick={() => router.push(item.url)}
								disabled={false}
							>
								{item.label}
							</IconButton>
						))}
					</div>
				</div>
				<div className="md:block hidden">
					<Image src="/images/dashboard-image.png" alt="" width={350} height={197.56} />
				</div>
			</Card>

			{/* <Card className="p-5">
				<h3 className="text-[#0C1E6A] text-base pb-5 font-bold">Wallet Asset</h3>
				<div className="lg:flex lg:justify-between grid grid-cols-2 grid-rows-2 gap-y-3">
					<div>
						<h3 className="text-base text-[#414141]">Active Trade</h3>
						<h3 className="text-[#08123B] font-bold text-xl">
							{signals?.totalActiveSignal}
						</h3>
					</div>
					<div>
						<h3 className="text-base text-[#414141]">Total Profit</h3>
						<h3 className="text-[#08123B] font-bold text-xl">
							{signals?.totalCapital}
						</h3>
					</div>
					<div>
						<h3 className="text-base text-[#414141]">Best performer</h3>
						<h3 className="text-[#08123B] font-bold text-xl">
							{signals?.bestSignal.amount}
						</h3>
					</div>
					<div>
						<h3 className="text-base text-[#414141]">Worst performer</h3>
						<h3 className="text-[#08123B] font-bold text-xl">
							{signals?.worseSignal?.amount}
						</h3>
					</div>
				</div>
			</Card> */}
			<Card className="p-5">
				<h3 className="font-semibold text-xl">For you Today </h3>
				<div className="mt-8 flex justify-between">
					<div className="flex gap-6">
						<div className="flex gap-0.5">
							<MessageIcon />
							<div className="-mt-2.5 w-[19px] h-[19px] bg-[#FF0808] rounded-full flex justify-center items-center font-semibold text-white text-[10px]">
								2
							</div>
						</div>
						<p className="text-base font-normal -mt-1">Tasks</p>
					</div>
					<div className="-mt-4 bg-[#F3F5F6] w-[40%] md:w-[20%] h-[49px] flex justify-center items-center rounded cursor-pointer">
						View Tasks
					</div>
				</div>
			</Card>
			<div className="my-6">
				<h2 className="text-[#08123B] font-bold py-3">Portfolio Summary</h2>
				<Card>
					<div className="flex flex-col lg:flex-row items-center lg:h-60">
						<div className="w-[75%] sm:w-[35%] md:w-[37%] lg:w-[30%]">
							<Chart />
						</div>
						<div className="text-center lg:text-start pb-10">
							<div className="flex flex-col items-center lg:items-start justify-center sm:justify-start lg:flex-row gap-2 lg:gap-4">
								<div className="flex gap-1 mb-2 lg:mb-0">
									<p className="font-bold text-sm">Capital</p>
									<p className="font-medium text-sm">0000.00</p>
									<p className="font-medium text-[10px] mt-1">USDT</p>
									<p className="font-normal text-sm">≈ $000.00</p>
								</div>
								<div className="flex gap-1.5">
									<p className="font-bold text-[13px]">Profit</p>
									<p className="font-medium text-sm text-[green]">
										{" "}
										+ 00%(00.00 USDT)
									</p>
									<p className="font-normal text-sm">≈$00.00</p>
								</div>
							</div>
							<p className="relative lg:left-32 font-extrabold text-base mt-2">
								No asset in your portfolio
							</p>
						</div>
					</div>
				</Card>
			</div>

			<div className="flex justify-between py-6 font-bold">
				<h4 className="text-[#08123B] text-base">Recent Activites</h4>
				<span className="text-[#1836B2] text-xs">
					<Link href="./transactions">see more</Link>
				</span>
			</div>
			<Table>
				<THead>
					<THeadData>Currency</THeadData>
					<THeadData>Transaction</THeadData>
					<THeadData>Amount</THeadData>
					<THeadData>Status</THeadData>
					<THeadData>Date</THeadData>
					<THeadData>Action</THeadData>
				</THead>
				<TBody>
					{transactionsResult?.transactions.map((item) => (
						<TBodyRow key={item.id}>
							<TBodyData>
								<div className="flex gap-3 items-start justify-start">
									<Image
										src={item.image}
										alt={item.shortName}
										className="w-[30px] h-[30px]"
										width={30}
										height={30}
									/>
									<div className="space-y-1 flex flex-col items-start text-[#1E1E1E] ">
										<span className="text-base font-semibold">
											{item.curency}
										</span>
										<span className="text-sm">{item.shortName}</span>
									</div>
								</div>
							</TBodyData>
							<TBodyData>{item.transaction}</TBodyData>
							<TBodyData>{item.amount}</TBodyData>
							<TBodyData>
								{item.status === "Active" ? (
									<div className="w-20 h-6 p-2 bg-emerald-50 rounded-lg justify-center items-center gap-2 inline-flex">
										<div className="w-2.5 h-2 bg-emerald-700 rounded-full" />
										{item.status}
									</div>
								) : (
									<div className="w-20 h-6 p-2 bg-orange-100 rounded-lg justify-center items-center gap-2 inline-flex">
										<div className="w-2.5 h-2 bg-amber-700 rounded-full" />
										{item.status}
									</div>
								)}
							</TBodyData>
							<TBodyData>{item.date}</TBodyData>
							<TBodyData>
								<DottedIcon />
							</TBodyData>
						</TBodyRow>
					))}
				</TBody>
			</Table>
		</div>
	);
};

Dashbaord.getLayout = (page: React.ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default Dashbaord;
