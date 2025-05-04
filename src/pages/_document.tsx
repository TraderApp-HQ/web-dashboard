import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="application-name" content="TraderApp" />
				<meta name="theme-color" content="#1836B2" /> {/* Primary color */}
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
				<meta name="apple-mobile-web-app-title" content="TraderApp" />
				<link rel="manifest" href="/manifest.json" />
				<link rel="icon" href="/images/logo.png" />
				<link rel="apple-touch-icon" href="/icons/icon-192x192.png" /> {/* For iOS */}
				<link
					href="https://fonts.googleapis.com/css2?family=Manrope&display=swap"
					rel="stylesheet"
				/>
				{/* <meta name="viewport" content="width=device-width,initial-scale=1" /> */}
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
