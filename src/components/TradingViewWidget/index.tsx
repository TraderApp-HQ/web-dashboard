import React, { useEffect, useRef, memo } from "react";

interface Asset {
	asset: {
		id: string;
		symbol: string;
	};
	baseCurrency: {
		symbol: string;
	};
}

interface TradingViewWidgetProps {
	signal: Asset;
}
const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ signal }) => {
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
          "symbol": "${signal?.asset?.symbol}${signal?.baseCurrency?.symbol}",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "allow_symbol_change": false,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
		container.current?.appendChild(script);
	}, [signal?.asset?.id]);

	return (
		<div className="w-full h-[580px]" ref={container}>
			<div className=" w-full h-[10rem]"></div>
			<div>
				<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
					<span className="blue-text">Track all markets on TradingView</span>
				</a>
			</div>
		</div>
	);
};

export default memo(TradingViewWidget);
