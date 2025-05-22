import { useEffect, useState } from "react";
import { differenceInSeconds, intervalToDuration, parseISO } from "date-fns";

const useWalletTransactionCountDownTimer = ({ expiresAt }: { expiresAt: string }) => {
	const [timeLeft, setTimeLeft] = useState<string>("");
	const [timeIsExpired, setTimeIsExpired] = useState<boolean>(false);

	useEffect(() => {
		const end = parseISO(expiresAt);

		const updateCountdown = () => {
			const now = new Date();
			const duration = intervalToDuration({ start: now, end });

			// Check if the time has expired
			if (differenceInSeconds(end, now) <= 0) {
				setTimeIsExpired(true);
				return;
			}

			setTimeLeft(
				`${duration.minutes?.toString().padStart(2, "0") ?? "00"}:${duration.seconds?.toString().padStart(2, "0") ?? "00"}`,
			); // Format as MM:SS
		};

		updateCountdown(); // Initial run

		const interval = setInterval(updateCountdown, 1000); // Update every second

		return () => clearInterval(interval); // Cleanup interval on component unmount
	}, [expiresAt]);

	return {
		timeLeft,
		timeIsExpired,
		setTimeIsExpired,
	};
};

export default useWalletTransactionCountDownTimer;
