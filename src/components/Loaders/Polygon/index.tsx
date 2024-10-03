import clsx from "clsx";
import type { PropsWithChildren } from "react";
import React from "react";

type PolygonVariant = "circle" | "rounded" | "square";
type PolygonSize = "sm" | "md" | "lg" | "xl";

interface PolygonBaseProps extends PropsWithChildren {
	/**
	 * The variant of the polygon.
	 * @type {PolygonVariant}
	 */
	variant: PolygonVariant;

	/**
	 * The size of the polygon.
	 * @type {PolygonSize}
	 */
	size: PolygonSize;

	/**
	 * The style of the polygon.
	 * @type {"open" | "closed"}
	 */
	opacity?: "open" | "closed";

	/**
	 * Additional classes to apply to the polygon.
	 * @type {string}
	 */
	className?: string;
}

const sizeMapping = {
	sm: "h-8 w-8",
	md: "h-12 w-12",
	lg: "h-16 w-16",
	xl: "h-20 w-20",
};

const circleStyleMapping = {
	open: "border-2 border-skeleton",
	closed: "bg-skeleton",
};

/**
 * A loader component that displays a polygon shape with customizable size, variant, and opacity.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.size="md"] - The size of the polygon. Possible values: "sm", "md", "lg".
 * @param {string} [props.variant="rounded"] - The variant of the polygon. Possible values: "rounded", "circle".
 * @param {string} [props.opacity="closed"] - The opacity of the polygon. Possible values: "open", "closed".
 * @param {string} [props.className] - Additional CSS class name(s) to apply to the component.
 * @returns {JSX.Element} The rendered Polygon component.
 */
const Polygon: React.FC<PolygonBaseProps> = ({
	size = "md",
	variant = "rounded",
	opacity = "closed",
	className,
}) => {
	let dimension = sizeMapping[size];
	let style = circleStyleMapping[opacity as "open" | "closed"];

	dimension =
		variant === "circle"
			? `${dimension} rounded-full`
			: `${dimension} ${variant === "rounded" ? "rounded-lg" : "rounded-none"}`;

	style = opacity === "open" ? `${style}` : "bg-skeleton";

	return <div className={clsx(`animate-pulse ${dimension}`, style, className)} />;
};

Polygon.defaultProps = {
	size: "md",
	variant: "rounded",
	opacity: "closed",
	className: "",
};
export default Polygon;
