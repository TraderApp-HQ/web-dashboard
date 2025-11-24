import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import React, { MouseEvent, useEffect, useState } from "react";
import { IDocsLength } from "~/apis/handlers/users/interfaces";
import { ISelectBoxOption } from "~/components/interfaces";
import SelectBox from "~/components/common/SelectBox";

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
				{title} {isActive && <span className="pl-[2px]">{docLen}</span>}
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
	const [selectedTab, setSelectedTab] = useState<ISelectBoxOption | null>(null);

	// Determine active tab
	const activeTabIndex = tabs.findIndex((tab) =>
		tab.query
			? tab.query === router.query.task
			: router.asPath.includes(tab.href.split("?")[0]),
	);

	const tabOptions: ISelectBoxOption[] = tabs.map((tab, index) => ({
		displayText: tab.title,
		value: tab.href,
		data: { query: tab.query, index },
	}));

	// Update selected dropdown option when route changes
	useEffect(() => {
		if (activeTabIndex !== -1) {
			setSelectedTab(tabOptions[activeTabIndex]);
		}
	}, [router.asPath, router.query]);

	const handleSelectOption = (option: ISelectBoxOption) => {
		const matchedTabIndex = tabs.findIndex((tab) =>
			option.data.query
				? router.query.task === tab.query
				: router.asPath.split("?")[0].endsWith(tab.href.split("?")[0]),
		);
		if (matchedTabIndex === -1) return;
		const newSelectedTab = tabs[option.data.index];
		if (newSelectedTab.query) {
			if (router.query.task !== newSelectedTab.query) {
				router.push({ query: { task: newSelectedTab.query } }, undefined, {
					shallow: true,
				});
			}
		} else if (!router.asPath.split("?")[0].endsWith(newSelectedTab.href.split("?")[0])) {
			router.push(newSelectedTab.href);
		}
	};

	// Modiefied selected option to include task count for task-center route
	const selectedOption = selectedTab || tabOptions[Math.max(0, activeTabIndex)];
	const modifiedSelectedOption: ISelectBoxOption = {
		...selectedOption,
		displayText: `${selectedOption.displayText}${
			docCount && docCount[selectedOption.data.query as keyof IDocsLength]
				? ` (${docCount[selectedOption.data.query as keyof IDocsLength]})`
				: ""
		}`,
	};

	return (
		<>
			<div className="md:hidden">
				<SelectBox
					options={tabOptions}
					option={modifiedSelectedOption}
					setOption={handleSelectOption}
					bgColor="bg-white"
					fontStyles="text-base font-bold"
					buttonClassName="border-gray-200 shadow-sm"
					caretSize="2em"
				/>
			</div>
			<div className="hidden md:block md:overflow-visible overflow-x-auto py-4">
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
										: router.asPath.includes(tab.href.split("?")[0])
								}
							/>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default PageTab;
