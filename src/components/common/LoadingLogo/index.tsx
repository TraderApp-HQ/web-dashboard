import React from "react";
import TraderAppLogo from "~/components/icons/TraderAppLogo";

interface LoadingLogoProps {
	className?: string;
	fullScreen?: boolean;
	showLogo?: boolean;
}

const LoadingLogo: React.FC<LoadingLogoProps> = ({
	className = "",
	fullScreen = true,
	showLogo = true,
}) => {
	const containerClasses = fullScreen
		? "h-screen flex items-center justify-center bg-white relative overflow-hidden"
		: `flex items-center justify-center ${className}`;

	return (
		<div className={containerClasses}>
			<div className="flex flex-col items-center justify-center z-10">
				{showLogo && (
					<div className="animate-pulse">
						<TraderAppLogo />
					</div>
				)}
			</div>
		</div>
	);
};

export default LoadingLogo;
