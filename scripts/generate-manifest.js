const fs = require("fs");
const path = require("path");

const isCI = process.env.CI === "true" || process.env.AWS_AMPLIFY === "true";
if (!isCI) {
	require("dotenv").config({ path: path.join(__dirname, "../.env") });
}

// Read environment variables
const env = process.env.NEXT_PUBLIC_APP_ENV || "production"; // Default to 'production'
const shortNameSuffix = env === "production" ? "" : `${env.charAt(0).toUpperCase() + env.slice(1)}`;

const manifest = {
	name: `TraderApp ${shortNameSuffix}`,
	short_name: `TraderApp ${shortNameSuffix}`,
	description: "Copy Trading Platform",
	start_url: "/",
	display: "standalone",
	background_color: "#ffffff",
	theme_color: "#1836B2",
	icons: [
		{
			src: "/icons/icon-192x192.png",
			sizes: "192x192",
			type: "image/png",
		},
		{
			src: "/icons/icon-512x512.png",
			sizes: "512x512",
			type: "image/png",
		},
	],
	screenshots: [
		{
			src: "/screenshots/mobile-screenshot.png",
			sizes: "864x1641",
			type: "image/png",
			form_factor: "narrow",
		},
		{
			src: "/screenshots/desktop-screenshot.png",
			sizes: "3584x2240",
			type: "image/png",
			form_factor: "wide",
		},
	],
};

// Write to public/manifest.json
fs.writeFileSync(
	path.join(__dirname, "../public/manifest.json"),
	JSON.stringify(manifest, null, 2),
);

console.log(`Generated manifest.json for environment: ${env}`);
