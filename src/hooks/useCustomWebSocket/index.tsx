// src/hooks/useCustomWebSocket.tsx
import useWebSocket from "react-use-websocket";
import { useEffect, useState } from "react";

function useCustomWebSocket<T = undefined>(url: string) {
	const [data, setData] = useState<string | null>(null);
	const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(url, {
		onOpen: () => console.log("WebSocket opened"),
		onClose: () => console.log("WebSocket closed"),
		onError: (error) => console.log("WebSocket error", error),
		shouldReconnect: () => true, // Will attempt to reconnect on all close events
	});

	useEffect(() => {
		if (lastMessage !== null) {
			setData(lastMessage.data);
		}
	}, [lastMessage]);

	return { data, sendMessage, readyState, getWebSocket };
}

export default useCustomWebSocket;
