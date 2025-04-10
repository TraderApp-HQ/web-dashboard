import CloudErrorIcon from "~/components/icons/CloudErrorIcon";

const ComponentError = ({ errorMessage }: { errorMessage?: string }) => {
	const message =
		errorMessage && errorMessage?.length > 1
			? errorMessage
			: "Something went wrong, please try refreshing the page.";
	return (
		<section className="w-full bg-white rounded-lg py-10 flex items-center justify-center gap-3">
			<CloudErrorIcon />
			<p className="font-medium text-sm text-textGray">{message}</p>
		</section>
	);
};

export default ComponentError;
