import Polygon from "../Polygon";

/**
 * Renders a SignalBreakDownLoader component.
 * @returns The rendered SignalBreakDownLoader component.
 */
const SignalBreakDownLoader: React.FC = () => {
	return (
		<div
			data-testid="signal-breakdown-loader"
			className="flex flex-col gap-5 py-[26px] px-[38px] rounded-lg bg-white"
		>
			<div className="w-full ">
				<Polygon
					size="xl"
					variant="rounded"
					className="flex-1 w-[65%] md:w-[50%] h-[17px] md:h-10 mb-20 md:mb-2"
				/>
				<Polygon
					size="xl"
					variant="rounded"
					className="flex-1 mx-auto md:mx-0 w-[70%] md:w-full h-[120px] md:h-[400px] -mb-1"
				/>
			</div>
			<div className="w-full">
				<Polygon
					size="xl"
					variant="rounded"
					className="w-[50%] h-[17px] md:h-10 mb-2 mx-auto md:mx-0"
				/>
				<Polygon
					size="xl"
					variant="rounded"
					className="flex-1 w-full md:w-[85%] h-[17px] md:h-[129px] mb-2"
				/>
			</div>
		</div>
	);
};

export default SignalBreakDownLoader;
