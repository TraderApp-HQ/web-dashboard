import React from "react";

interface IProps {
	className?: string;
	onClick?: () => void;
}

const RemoveIcon: React.FC<IProps> = ({ className = "", onClick }) => (
	<svg
		width="22"
		height="22"
		viewBox="0 0 22 22"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		onClick={onClick}
	>
		<g id="icons8:cancel">
			<path
				id="Vector"
				d="M11 2.0625C6.072 2.0625 2.0625 6.072 2.0625 11C2.0625 15.928 6.072 19.9375 11 19.9375C15.928 19.9375 19.9375 15.928 19.9375 11C19.9375 6.072 15.928 2.0625 11 2.0625ZM11 3.4375C15.1848 3.4375 18.5625 6.81519 18.5625 11C18.5625 15.1848 15.1848 18.5625 11 18.5625C6.81519 18.5625 3.4375 15.1848 3.4375 11C3.4375 6.81519 6.81519 3.4375 11 3.4375ZM8.40125 7.41125L7.41125 8.40125L10.0128 11L7.41262 13.5988L8.40263 14.5887L11 11.9879L13.5988 14.5867L14.5887 13.5988L11.9879 11L14.5867 8.40125L13.5988 7.41125L11 10.0128L8.40125 7.41262V7.41125Z"
				fill="#2C2929"
			/>
		</g>
	</svg>
);

export default RemoveIcon;
