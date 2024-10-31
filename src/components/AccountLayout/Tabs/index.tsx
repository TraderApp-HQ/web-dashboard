import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import React, { MouseEvent } from "react";

interface TabProps {
	href?: string;
	title: string;
	query?: string;
	isActive: boolean;
	docCount?: number;
}

function Tab({ href, title, query, isActive, docCount }: TabProps) {
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
				"px-2 py-2 mx-0 focus:outline-none text-base font-bold leading-normal whitespace-nowrap",
				`${isActive ? "border-b-2 border-blue-800 text-blue-800" : "text-zinc-500"}`,
			)}
			aria-label={title}
			onClick={query ? handleQueryParam : undefined}
		>
			<div className="whitespace-nowrap px-2">
				{title} <span className="text-base pl-2">{isActive && docCount}</span>
			</div>
		</Link>
	);
}

interface PageTabProps {
	tabs: { title: string; href: string; query?: string }[];
	docCount?: number;
}

const PageTab: React.FC<PageTabProps> = ({ tabs, docCount }) => {
	const router = useRouter();
	return (
		<div className="md:overflow-visible overflow-x-auto py-4">
			<div className="flex border-b gap-x-8 md:gap-x-[27px] w-fit">
				{tabs.map((tab, index) => (
					<Tab
						key={index}
						title={tab.title}
						href={tab.href}
						query={tab.query}
						docCount={docCount}
						isActive={
							tab.query
								? tab.query === router.query.task
								: router.asPath.endsWith(tab.href)
						}
					/>
				))}
			</div>
		</div>
	);
};

export default PageTab;
