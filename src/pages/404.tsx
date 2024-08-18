import Image from "next/image";
import { useRouter } from "next/router";
import Button from "~/components/AccountLayout/Button";
import RightArrowIcon from "~/components/icons/RightArrowIcon";

export default function NotFound() {
	const router = useRouter();

	// handle redirect back to /account/dashboard
	const handleRedirect = () => {
		router.replace("/account/dashboard");
	};

	return (
		<div className="max-w-screen-md mx-auto p-5 space-y-4  flex-col items-center justify-center">
			<div className="text-center space-y-2">
				<h1 className="text-[#102477] font-semibold">404 Not Found</h1>
				<h3 className="text-3xl font-semibold text-[#17294F]">We lost this page</h3>
				<p className="text-base text-[#808080]">
					Oops! Something went wrong! Help us improve your experience by sending an error
					report.
				</p>
			</div>
			<div className="w-full mx-auto max-w-md">
				<Image
					loading="eager"
					src="/images/not-found.png"
					alt="not found"
					className="object-contain w-full"
					layout="fill"
				/>
			</div>

			<div className="max-w-sm mx-auto">
				<Button
					innerClassName="text-white gap-x-4 normal-case"
					fluid
					onClick={handleRedirect}
				>
					Back to home <RightArrowIcon color="white" />
				</Button>
			</div>
		</div>
	);
}
