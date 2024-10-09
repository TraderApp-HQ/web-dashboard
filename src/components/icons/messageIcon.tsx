import React from "react";

const MessageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
	return (
		<svg
			width="20"
			height="16"
			viewBox="0 0 20 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			stroke="#1836B2"
			{...props}
		>
			<path
				d="M18.3332 3.00016C18.3332 2.0835 17.5832 1.3335 16.6665 1.3335H3.33317C2.4165 1.3335 1.6665 2.0835 1.6665 3.00016M18.3332 3.00016V13.0002C18.3332 13.9168 17.5832 14.6668 16.6665 14.6668H3.33317C2.4165 14.6668 1.6665 13.9168 1.6665 13.0002V3.00016M18.3332 3.00016L9.99984 8.8335L1.6665 3.00016"
				strokeWidth="2.33333"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
export default MessageIcon;
