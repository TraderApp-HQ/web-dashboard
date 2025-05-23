import React from "react";

interface IButton {
	labelText: string;
	disabled?: boolean;
	className?: string;
	onClick: () => void;
	isProcessing?: boolean;
}

const Button: React.FC<IButton> = ({ labelText, disabled, className, onClick, isProcessing }) => {
	return (
		<button
			disabled={disabled}
			type="button"
			className={`transition-opacity duration-300 bg-[#1836B2] rounded-md px-3 py-4 font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
			onClick={onClick}
		>
			{isProcessing ? "Processing..." : labelText}
		</button>
	);
};

Button.defaultProps = {};

export default Button;
