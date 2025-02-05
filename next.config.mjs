// import withPWA from "next-pwa";
import withPWA from "@ducanh2912/next-pwa";

// /** @type {import('next').NextConfig} */
// const nextConfig = {
// 	reactStrictMode: true,
// 	images: {
// 		remotePatterns: [
// 			{
// 				protocol: "https",
// 				hostname: "s2.coinmarketcap.com",
// 				port: "",
// 				pathname: "/**",
// 			},
// 			{
// 				protocol: "https",
// 				hostname: "flagcdn.com",
// 				port: "",
// 				pathname: "/**",
// 			},
// 			{
// 				protocol: "https",
// 				hostname: "upload.wikimedia.org",
// 				port: "",
// 				pathname: "/**",
// 			},
// 			{
// 				protocol: "https",
// 				hostname: "aws-s3-dev-assets-service.s3.eu-west-1.amazonaws.com",
// 				port: "",
// 				pathname: "/**",
// 			},
// 			{
// 				protocol: "https",
// 				hostname: "aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com",
// 				port: "",
// 				pathname: "/**",
// 			},
// 		],
// 	},
// };

// const nextConfig = withPWA({
// 	reactStrictMode: true,
// 	images: {
// 		remotePatterns: [
// 			{
// 				protocol: "https",
// 				hostname: "s2.coinmarketcap.com",
// 				port: "",
// 				pathname: "/**",
// 			},
// 			{
// 				protocol: "https",
// 				hostname: "flagcdn.com",
// 				port: "",
// 				pathname: "/**",
// 			},
// 			{
// 				protocol: "https",
// 				hostname: "upload.wikimedia.org",
// 				port: "",
// 				pathname: "/**",
// 			},
// 			{
// 				protocol: "https",
// 				hostname: "aws-s3-dev-assets-service.s3.eu-west-1.amazonaws.com",
// 				port: "",
// 				pathname: "/**",
// 			},
// 			{
// 				protocol: "https",
// 				hostname: "aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com",
// 				port: "",
// 				pathname: "/**",
// 			},
// 		],
// 	},
// 	pwa: {
// 		dest: "public",
// 		disable: process.env.NODE_ENV === "development",
// 		// disable: false,
// 		register: true,
// 		skipWaiting: true,
// 	},
// });

const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "s2.coinmarketcap.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "flagcdn.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "upload.wikimedia.org",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "aws-s3-dev-assets-service.s3.eu-west-1.amazonaws.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com",
				pathname: "/**",
			},
		],
	},
};

export default withPWA({
	...nextConfig, // Spread nextConfig here
	pwa: {
		dest: "public",
		register: true,
		skipWaiting: true,
		disable: process.env.NODE_ENV === "development", // Only enable in production
	},
});

// export default nextConfig;
