import clsx from "clsx";

interface OverlayContainerProps {
	children: React.ReactNode;
	className?: string;
	subClass?: string;
}

export default function OverlayContainer({ children, className, subClass }: OverlayContainerProps) {
	return (
		<div className={`fixed left-0 top-1 -sm:top-5 w-full ${className ? className : "left-0"}`}>
			<div
				className={clsx(
					"p-2.5 rounded-lg w-full h-screen md:px-[5%] px-4 overflow-y-auto",
					subClass,
				)}
			>
				{children}
			</div>
		</div>
	);
}
