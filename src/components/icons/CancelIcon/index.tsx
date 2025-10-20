import React from "react";

const CancelIcon = ({ onClick }: { onClick?: () => void }) => {
	return (
		<button
			type="button"
			className="absolute top-7 end-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
			onClick={onClick}
		>
			<svg
				viewBox="0 0 25 25"
				className="w-4 h-4"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M19.6802 5.67969L6.18018 19.1797"
					stroke="#414141"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M19.6802 19.1797L6.18018 5.67969"
					stroke="#414141"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</button>
	);
};

export default CancelIcon;
