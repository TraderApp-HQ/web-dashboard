import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import React from "react";

interface TabProps {
	href?: string;
	title: string;
	isActive: boolean;
}

function Tab({ href, title, isActive }: TabProps) {
	return (
		<Link
			href={`${href}`}
			className={clsx(
				"px-2 py-2 mx-0 focus:outline-none text-base font-bold leading-normal whitespace-nowrap",
				`${isActive ? "border-b-2 border-blue-800 text-blue-800" : "text-zinc-500"}`,
			)}
			aria-label={title}
		>
			<div className="whitespace-nowrap px-2">{title}</div>
		</Link>
	);
}

interface PageTabProps {
	tabs: { title: string; href: string }[];
}

const PageTab: React.FC<PageTabProps> = ({ tabs }) => {
	const router = useRouter();
	return (
		<div className="md:overflow-visible overflow-x-auto py-4">
			<div className="flex border-b gap-x-8 md:gap-x-[27px] w-fit">
				{tabs.map((tab, index) => (
					<Tab
						key={index}
						title={tab.title}
						href={tab.href}
						isActive={router.asPath.endsWith(tab.href)}
					/>
				))}
			</div>
		</div>
	);
};

export default PageTab;
