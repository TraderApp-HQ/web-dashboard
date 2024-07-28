import { useState, useEffect } from "react";

interface FetchData {
	data: string;
}

export function useFetchData(url: string) {
	const [data, setData] = useState<FetchData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}
				const result = await response.json();
				setData(result);
			} catch (err) {
				setError(err as unknown as Error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [url]);

	return { data, loading, error };
}
