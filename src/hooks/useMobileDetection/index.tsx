import { useEffect, useState } from "react";

export const useMobileDetection = () => {
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 768px)");

		setIsMobile(mediaQuery.matches);
		setIsLoading(false);

		const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);

	return { isMobile, isLoading };
};
