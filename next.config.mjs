/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["s2.coinmarketcap.com", "flagcdn.com", "upload.wikimedia.org"],
	},
};

export default nextConfig;
