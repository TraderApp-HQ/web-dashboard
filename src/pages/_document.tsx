import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link
					href="https://fonts.googleapis.com/css2?family=Manrope&display=swap"
					rel="stylesheet"
				/>
				<meta charSet="utf-8" />
				{/* <meta name="viewport" content="width=device-width,initial-scale=1" /> */}
				<link rel="icon" href="/images/logo.png" />
				<link rel="manifest" href="/manifest.json" />
				<link rel="apple-touch-icon" sizes="192x192" href="/images/logo.png" />
				<meta name="theme-color" content="#000000" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
