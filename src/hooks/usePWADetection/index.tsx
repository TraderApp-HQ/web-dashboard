import { useEffect, useState } from "react";

declare global {
	interface Navigator {
		standalone?: boolean;
	}
}

export const usePWADetection = () => {
	const [isPWA, setIsPWA] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const checkPWA = () => {
			return (
				window.matchMedia("(display-mode: standalone)").matches ||
				window.navigator?.standalone ||
				document.referrer.includes("android-app://")
			);
		};

		setIsPWA(checkPWA());
		setIsLoading(false);

		const displayModeQuery = window.matchMedia("(display-mode: standalone)");
		const handleChange = () => setIsPWA(checkPWA());

		displayModeQuery.addEventListener("change", handleChange);

		return () => {
			displayModeQuery.removeEventListener("change", handleChange);
		};
	}, []);

	return { isPWA, isLoading };
};
