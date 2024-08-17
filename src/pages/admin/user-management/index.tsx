import { useEffect, useState } from "react";
import Button from "~/components/common/Button";
import DropdownMenu, { DropdownMenuItem } from "~/components/AccountLayout/DropdownMenu";
import SearchForm from "~/components/AccountLayout/SearchForm";
import Pagination from "~/components/Pagination";
import { DataTable } from "~/components/common/DataTable";
import DropdownIcon from "~/components/icons/DropdownIcon";
import { usersDataTableSelector } from "~/selectors/user-management";
import useUsers from "~/hooks/useUsers";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import AdminLayout from "~/components/AdminLayout/Layout";
import { useRouter } from "next/router";
import EmptyUser from "~/components/AdminLayout/User/EmptyUser";

const UserManagement = () => {
	const router = useRouter();
	const searchKeywordInitial = Array.isArray(router.query.query)
		? router.query.query[0]
		: router.query.query || "";
	const params = new URLSearchParams();

	const [searchKeyword, setSearchKeyword] = useState(searchKeywordInitial);
	const [currentPage, setCurrentPage] = useState(Number(router.query.page) || 1);
	const [rowsPerPage, setRowsPerPage] = useState(Number(router.query.rows) || 10);

	const { data, refetch, error, isLoading, isSuccess, isError } = useUsers({
		searchKeyword,
		currentPage,
		rowsPerPage,
	});

	useEffect(() => {
		if (currentPage) {
			params.set("page", currentPage.toString());
		}
		if (rowsPerPage) {
			params.set("rows", rowsPerPage.toString());
		}
		if (searchKeyword) {
			params.set("query", searchKeyword);
		}
	}, [currentPage, rowsPerPage, searchKeyword]);

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		if (searchKeyword) {
			params.set("query", searchKeyword);
		}
		router.push({
			pathname: router.pathname,
			query: params.toString(),
		});

		e.preventDefault();
		refetch();
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	const users = isSuccess ? data.docs : [];
	const { tableHead, tableBody } = usersDataTableSelector(users);

	return (
		<div>
			<div className="flex justify-between">
				<h3>All users</h3>
				{users.length !== 0 && (
					<Button
						onClick={() =>
							router.push(
								`${LAYOUT_ROUTES.admin}/${ROUTES.usermanagement.homepage}/${ROUTES.usermanagement.create}`,
							)
						}
						labelText="Create new user"
					/>
				)}
			</div>
			<div className="flex justify-between">
				<SearchForm
					onChange={(e) => setSearchKeyword(e.target.value)}
					aria-label="search asset"
					placeHolder="Search for firstname lastname, etc..."
					onSubmit={handleSearch}
					defaultValue={searchKeyword}
				/>
				<DropdownMenu
					className="w-[256px]"
					btnClass="mt-6 w-24 h-12 px-1.5 py-3 bg-sky-200 bg-opacity-20 rounded-lg border"
					trigger={
						<>
							<div className="text-sky-900 text-base font-normal leading-snug">
								Filter
							</div>
							<DropdownIcon />
						</>
					}
					position="left"
				>
					<DropdownMenuItem className="flex flex-col gap-y-2">
						<div></div>
					</DropdownMenuItem>
				</DropdownMenu>
			</div>

			{users.length === 0 ? (
				<div className="flex mt-48 justify-center min-h-screen">
					<EmptyUser />
				</div>
			) : (
				<>
					<h3 className="mb-2">User ({data?.totalDocs ?? 0})</h3>
					<div className="pb-8 rounded-2xl">
						<div className="hidden md:block p-5 bg-white rounded-2xl relative overflow-x-auto">
							<DataTable
								tableStyles="mb-4"
								justifyMenueItem="justify-normal"
								tableHeadStyles="text-justify"
								tableRowItemStyles="text-justify"
								hasMenueItems
								menueItemType="icon-button"
								tHead={tableHead}
								tBody={tableBody}
							/>
							<Pagination
								currentPage={data?.page ?? 1}
								totalPages={data?.totalPages ?? 0}
								rowsPerPage={rowsPerPage}
								totalRecord={data?.totalDocs ?? 0}
								setRowsPerPage={setRowsPerPage}
								onNext={() => setCurrentPage((prev) => prev + 1)}
								onPrev={() => setCurrentPage((prev) => prev - 1)}
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

UserManagement.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default UserManagement;
