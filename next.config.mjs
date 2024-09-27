/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
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
		],
	},
};

export default nextConfig;
