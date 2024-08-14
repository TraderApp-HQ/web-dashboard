import { useCallback, useState } from "react";
import Card from "~/components/AccountLayout/Card";
import Table, {
	THead,
	THeadData,
	TBody,
	TBodyRow,
	TBodyData,
} from "~/components/AccountLayout/Table";
import ChartOverview from "~/components/Chart/ChartOverview";
import DashboardAllocation from "~/components/Chart/DashboardAllocation";
import HidenBalance from "~/components/Wallet/HidenBalance";
import DottedIcon from "~/components/icons/DottedIcon";
import EyesIcon from "~/components/icons/EyesIcon";
import data from "~/data/wallet/data.json";
import IconButton from "~/components/AccountLayout/IconButton";
import DepositIcon from "~/components/icons/DepositIcon";
import { useRouter } from "next/router";
import WithdrawIcon from "~/components/icons/WithdrawIcon";
import TransferIcon from "~/components/icons/TransferIcon";
import ConvertIcon from "~/components/icons/ConvertIcon";
import { ROUTES } from "~/config/constants";
import { useFetch } from "~/hooks/useFetch";
import { UsersService } from "~/apis/handlers/users";
import { UsersQueryId } from "~/apis/handlers/users/constants";
import { Line } from "~/components/Loaders";
import Link from "next/link";
import AccountLayout from "~/components/AccountLayout/Layout";

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
		{
			label: "Transfer",
			url: ROUTES.wallet.transfer,
			icon: TransferIcon,
		},
		{
			label: "Convert",
			url: ROUTES.wallet.convert,
			icon: ConvertIcon,
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
				<div>
					{/* {isLoading && <div>Loading...</div>} */}
					{isLoading && (
						<div className="space-y-1 mb-2">
							<Line width="md" height="lg" />
							<Line width="lg" height="sm" />
						</div>
					)}
					{error && <div className="text-danger">{error.message}</div>}
					{userProfile && (
						<div className="pb-9">
							<h3 className="text-[#102477] font-bold text-3xl">
								Hello {userProfile.firstName} !
							</h3>
							<h5 className="text-base">Welcome back to your account,</h5>
						</div>
					)}
					<div
						className="flex justify-start space-x-2"
						onClick={() => handleShowBalance(!showBalance)}
					>
						<h4 className="font-bold text-base">Total Balance</h4>
						<EyesIcon />
					</div>
					<h3 className="mt-3 text-xl font-bold">
						{isLoading ? (
							<Line width="md" height="lg" />
						) : showBalance ? (
							`${data?.wallet?.totalBalance} USD`
						) : (
							<HidenBalance className="mt-6 mb-2" />
						)}
					</h3>
					<div className="flex justify-between md:space-x-2 py-4 text-xs">
						{supportedOperations.map((item, index) => (
							<IconButton
								key={index}
								Icon={item.icon}
								btnClass="bg-stone-50 px-4 text-zinc-500 gap-2"
								onClick={() => router.push(item.url)}
								disabled={false}
							>
								{item.label}
							</IconButton>
						))}
					</div>
				</div>
				<div className="h-40 w-40 mr-16 md:block hidden">
					<img src="/images/dashboard_image.png" />
				</div>
			</Card>

			<Card className="p-5">
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
			</Card>

			<div className="my-6">
				<h2 className="text-[#08123B] font-bold py-3">Portfolio Overview</h2>
				<div className="flex flex-col lg:flex-row justify-start lg:space-x-6">
					<ChartOverview />
					<DashboardAllocation />
				</div>
			</div>

			<div className="flex justify-between py-6 font-bold">
				<h4 className="text-[#08123B] text-base">All Transactions</h4>
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
						<TBodyRow>
							<TBodyData>
								<div className="flex gap-3 items-start justify-start">
									<img
										src={item.image}
										alt={item.shortName}
										width={"30px"}
										height={"30px"}
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
