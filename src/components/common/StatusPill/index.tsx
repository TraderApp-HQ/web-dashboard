import React from "react";
import { ColourTheme } from "~/config/enum";
import { capitalizeFirstLetter } from "~/helpers";

interface IOperationStatus {
	status: string;
	theme: ColourTheme;
	style?: {
		justify?: string;
	};
	bullet?: boolean;
}

const OperationStatus: React.FC<IOperationStatus> = ({
	status,
	theme,
	style = { justify: "justify-end sm:justify-center" },
	bullet = true, // defaults to true to display bullet
}) => {
	const statusText = capitalizeFirstLetter(status);
	let roundedIconStyles: string;
	let statusContainerStyles: string;

	switch (theme) {
		case ColourTheme.SUCCESS: {
			roundedIconStyles = "bg-[#08875D]";
			statusContainerStyles = "bg-[#EDFDF8] text-[#08875D]";
			break;
		}
		case ColourTheme.WARNING: {
			roundedIconStyles = "bg-[#B25E09]";
			statusContainerStyles = "bg-[#FCE7CC] text-[#B25E09]";
			break;
		}
		case ColourTheme.DANGER: {
			roundedIconStyles = "bg-[#E02D3C]";
			statusContainerStyles = "bg-[#FEF1F2] text-[#E02D3C]";
			break;
		}
		case ColourTheme.REVIEW: {
			roundedIconStyles = "bg-[#082DC7]";
			statusContainerStyles = "bg-[#F3F6FF] text-[#082DC7]";
			break;
		}
		case ColourTheme.TERTIARY: {
			roundedIconStyles = "bg-[#3E57BF]";
			statusContainerStyles = "bg-[#E7ECFF] text-[#3E57BF]";
			break;
		}
		case ColourTheme.TERTIARY2: {
			roundedIconStyles = "bg-[#234475]";
			statusContainerStyles = "bg-[#F2FCFF] text-[#234475]";
			break;
		}
		default: {
			roundedIconStyles = "";
			statusContainerStyles = "";
		}
	}

	return (
		<div className={`flex ${style.justify}`}>
			<div
				className={`flex px-3 py-1.5 font-black rounded-lg justify-center items-center gap-2 ${statusContainerStyles}`}
			>
				{bullet && <div className={`p-1 rounded-full ${roundedIconStyles}`}></div>}
				<div className="capitalize">{statusText}</div>
			</div>
		</div>
	);
};

export default OperationStatus;
