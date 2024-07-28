import "@/styles/globals.css";
import type { AppProps } from "next/app";

// if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
//   const { worker } = require('../src/mocks/browser');
//   worker.start();
// }

export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
