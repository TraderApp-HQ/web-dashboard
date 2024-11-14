import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import React, { MouseEvent } from "react";
import { IDocsLength } from "~/apis/handlers/users/interfaces";

interface TabProps {
	href?: string;
	title: string;
	query?: string;
	isActive: boolean;
	docLen?: number;
}

function Tab({ href, title, query, isActive, docLen }: TabProps) {
	const router = useRouter();

	const handleQueryParam = (e: MouseEvent<HTMLAnchorElement>) => {
		if (query) {
			e.preventDefault();
			router.push({ query: { task: query } }, undefined, { shallow: true });
		}
	};

	return (
		<Link
			href={`${href}`}
			className={clsx(
				"px-1 md:px-4 py-2 mx-0 focus:outline-none text-xs md:text-base font-bold leading-normal whitespace-nowrap",
				`${isActive ? "border-b-2 border-blue-800 text-blue-800" : "text-zinc-500"}`,
			)}
			aria-label={title}
			onClick={query ? handleQueryParam : undefined}
		>
			<div className="whitespace-nowrap">
				{title} <span className="pl-[2px]">{docLen}</span>
			</div>
		</Link>
	);
}

interface PageTabProps {
	tabs: { title: string; href: string; query?: string }[];
	docCount?: IDocsLength;
}

const PageTab: React.FC<PageTabProps> = ({ tabs, docCount }) => {
	const router = useRouter();
	return (
		<div className="md:overflow-visible overflow-x-auto py-4">
			<div className="flex border-b gap-x-2 md:gap-x-[27px] w-fit">
				{tabs.map((tab, index) => {
					// Check if the query matches one of the expected keys in IDocsLength interface
					const queryKey = tab.query as keyof IDocsLength;

					return (
						<Tab
							key={index}
							title={tab.title}
							href={tab.href}
							query={tab.query}
							docLen={queryKey ? docCount?.[queryKey] : undefined}
							isActive={
								tab.query
									? tab.query === router.query.task
									: router.asPath.endsWith(tab.href)
							}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default PageTab;
