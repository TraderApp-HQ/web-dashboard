import React from "react";
import clsx from "clsx";
import { FiCheckCircle } from "react-icons/fi";
import { CiCircleInfo } from "react-icons/ci";
import { IoWarningOutline } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
import { LiaTimesSolid } from "react-icons/lia";

// Define the types for the props
type ToastType = "success" | "info" | "warning" | "error";
type ToastVariant = "outlined" | "filled";

/**
 * Props for the Toast component.
 */
interface ToastProps {
	/**
	 * The type of the toast.
	 * @type {'success' | 'info' | 'warning' | 'error'}
	 */
	type?: ToastType;

	/**
	 * The variant of the toast.
	 * @type {'outlined' | 'filled'}
	 */
	variant?: ToastVariant;

	/**
	 * The main title of the toast.
	 * @type {string}
	 */
	title: string;

	/**
	 * An optional detailed message for the toast.
	 * @type {string}
	 */
	message?: string;

	/**
	 * An optional flag to auto-vanish the toast after a few seconds.
	 * @type {boolean}
	 */
	autoVanish?: boolean;

	/**
	 * The timeout in seconds to auto-vanish the toast.
	 * @type {number}
	 */
	autoVanishTimeout?: number;

	// Opens to from parent component
	showToast?: boolean;

	// Updates toast state on parent component
	onToastClose?: () => void;
}

const iconSize = 23;
const typeClasses = {
	success: {
		icon: <FiCheckCircle color="#00944D" size={iconSize} />,
		base: "text-success",
		outlined: "bg-transparent",
		filled: "bg-success-light text-success border border-success",
	},
	info: {
		icon: <CiCircleInfo color="#3E57BF" size={iconSize} />,
		base: "text-info",
		outlined: "bg-transparent",
		filled: "bg-info-light text-info border border-info",
	},
	warning: {
		icon: <IoWarningOutline color="#B25E09" size={iconSize} />,
		base: "text-warning",
		outlined: "bg-transparent",
		filled: "bg-warning-light text-warning border border-warning",
	},
	error: {
		icon: <MdErrorOutline color="#BA2532" size={iconSize} />,
		base: "text-danger",
		outlined: "bg-transparent",
		filled: "bg-danger-light text-danger border border-danger",
	},
};

/**
 * A toast notification component.
 * @param {ToastProps} props {type, variant, message, title} - The props for the component.
 * @returns {React.ReactElement} The toast notification component.
 * @constructor Toast
 * @example <Toast type="success" variant="outlined" title="Success title" />
 */
const Toast: React.FC<ToastProps> = ({
	title,
	message,
	autoVanish,
	type = "success",
	variant = "filled",
	autoVanishTimeout = 10,
	showToast = true,
	onToastClose,
}) => {
	const [show, setShow] = React.useState(showToast);

	const handleClose = () => {
		setShow(false);
		onToastClose && onToastClose();
	};

	React.useEffect(() => {
		if (autoVanish) {
			const timeout = setTimeout(() => {
				handleClose();
			}, autoVanishTimeout * 1000);

			return () => clearTimeout(timeout);
		}
	}, [autoVanish, autoVanishTimeout]);

	const styles = clsx(
		`bg-white flex items-start p-4 rounded-md shadow-md ${!show ? "hidden" : ""}`,
		variant === "outlined" ? `border ${typeClasses[type].outlined}` : typeClasses[type].filled,
	);

	return (
		<div
			data-testid="toast-message"
			className={`fixed z-50 right-1 top-1 min-w-[400px] ${styles} ${type === "success" && "bg-[#F7FFFC]"}`}
		>
			<div className="flex-shrink-0 self-baseline">{typeClasses[type].icon}</div>
			<div className="ml-3 w-full">
				<div className="flex items-center justify-between">
					<h3
						className={`font-normal ${typeClasses[type].base} ${type === "success" && "text-[#00944D]"} text-base`}
					>
						{title}
					</h3>
					<button className="btn" onClick={handleClose}>
						<LiaTimesSolid size={20} />
					</button>
				</div>
				{message && (
					<p className={`mt-1 text-sm ${type === "success" && "text-[#08875D]"}`}>
						{message}
					</p>
				)}
			</div>
		</div>
	);
};

export default Toast;

// Example usage:
// <Toast type="success" variant="outlined" title="Success title" />
// <Toast type="info" variant="filled" title="Info title" message="This is an info message." />
// <Toast type="warning" variant="outlined" title="Warning title" message="This is a warning message." />
// <Toast type="error" variant="filled" title="Error title" message="This is an error message." />
// <Toast type="error" variant="filled" title="Error title" message="This is an error message." autoVanish autoVanishTimeout={10}/>
