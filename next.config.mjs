import nextPwa from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async headers() {
		return [
			{
				source: "/api/:path*",
				headers: [
					{
						key: "Access-Control-Allow-Credentials",
						value: "true",
					},
					{
						key: "Access-Control-Allow-Origin",
						value: "*",
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "Content-Type, Authorization, Cookie",
					},
				],
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "s2.coinmarketcap.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "flagcdn.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "upload.wikimedia.org",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "aws-s3-dev-assets-service.s3.eu-west-1.amazonaws.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "sandbox-cs-ledger.s3.eu-west-1.amazonaws.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

const withPwa = nextPwa({
	dest: "public",
	register: true,
	skipWaiting: true,
	// important to avoid running the generation everytime on your local environment
	disable: process.env.NODE_ENV === "development",
	swSrc: "public/custom-sw.js", // <-- add this line
});

export default withPwa(nextConfig);
