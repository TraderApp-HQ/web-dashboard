import React, { useEffect, useRef, memo } from "react";

interface Asset {
	signal: {
		id: string;
		name: string;
		symbol: string;
		logo: string;
	};
}

interface TradingViewWidgetProps {
	signal: Asset;
}

function TradingViewWidget({ signal }: TradingViewWidgetProps) {
	const container = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		// Clear previous script instance if exists
		if (container.current) {
			container.current.innerHTML = "";
		}

		const script = document.createElement("script");
		script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
		script.type = "text/javascript";
		script.async = true;
		script.innerHTML = `
        {
          "autosize": true,
          "symbol": "${signal?.asset?.symbol}",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
		container.current?.appendChild(script);
	}, [signal?.asset?.id]);

	return (
		<div
			className="tradingview-widget-container"
			ref={container}
			style={{ height: "100%", width: "100%" }}
		>
			<div
				className="tradingview-widget-container__widget"
				style={{ height: "calc(100% - 82px)", width: "100%" }}
			></div>
			<div className="tradingview-widget-copyright">
				<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
					<span className="blue-text">Track all markets on TradingView</span>
				</a>
			</div>
		</div>
	);
}

export default memo(TradingViewWidget);
