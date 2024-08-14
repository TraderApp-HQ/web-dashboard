import clsx from "clsx";
import React from "react";

interface CardProps {
	children: React.ReactNode;
	className?: string;
}
export default function Card({ children, className }: CardProps) {
	return <div className={clsx("p-2.5 bg-white rounded-lg w-full", className)}>{children}</div>;
}
