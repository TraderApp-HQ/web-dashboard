import { useState, useCallback } from "react";

export const useCopyToClipboard = () => {
	const [copyMessage, setCopyMessage] = useState<string | undefined>(undefined);

	const copyToClipboard = useCallback(async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopyMessage("Copied to clipboard!");
		} catch (error) {
			console.error("Failed to copy text: ", error);
			setCopyMessage("Failed to copy.");
		}
	}, []);

	return { copyToClipboard, copyMessage, setCopyMessage };
};
