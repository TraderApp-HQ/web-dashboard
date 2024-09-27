/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			"s2.coinmarketcap.com",
			"flagcdn.com",
			"upload.wikimedia.org",
			"aws-s3-dev-assets-service.s3.eu-west-1.amazonaws.com",
		],
	},
};

export default nextConfig;
