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
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
