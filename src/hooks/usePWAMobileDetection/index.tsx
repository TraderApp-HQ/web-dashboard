import { useMobileDetection } from "../useMobileDetection";
import { usePWADetection } from "../usePWADetection";

export const usePWAMobileDetection = () => {
	const { isPWA, isLoading: isPWALoading } = usePWADetection();
	const { isMobile, isLoading: isMobileLoading } = useMobileDetection();

	const isLoading = isPWALoading || isMobileLoading;
	const isMobileAndPWA = isMobile && isPWA;

	return {
		isPWA,
		isMobile,
		isMobileAndPWA,
		isLoading,
	};
};
