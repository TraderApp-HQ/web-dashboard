import React from "react";

interface IProps {
	color?: string;
}

const UserIcon: React.FC<IProps> = ({ color = "#414141" }) => {
	return (
		<svg
			width="25"
			height="25"
			viewBox="0 0 25 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M12.3445 22.5221C8.65273 22.5221 5.5 21.9476 5.5 19.6469C5.5 17.3461 8.63273 15.2221 12.3445 15.2221C16.0364 15.2221 19.1891 17.3255 19.1891 19.6263C19.1891 21.9261 16.0564 22.5221 12.3445 22.5221Z"
				stroke={color}
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M12.3372 12.0339C14.76 12.0339 16.7236 10.0702 16.7236 7.6475C16.7236 5.22477 14.76 3.26022 12.3372 3.26022C9.91452 3.26022 7.94998 5.22477 7.94998 7.6475C7.9418 10.062 9.8918 12.0257 12.3063 12.0339C12.3172 12.0339 12.3272 12.0339 12.3372 12.0339Z"
				stroke={color}
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
};

export default UserIcon;
