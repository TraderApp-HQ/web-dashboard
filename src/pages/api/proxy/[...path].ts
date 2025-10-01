/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Handle preflight requests
	if (req.method === "OPTIONS") {
		res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
		res.setHeader("Access-Control-Allow-Credentials", "true"); // Add this
		res.status(200).end();
		return;
	}

	const { path } = req.query;
	const apiPath = Array.isArray(path) ? path.join("/") : path || "";

	// Add early return if no path
	if (!apiPath) {
		return res.status(404).json({ error: "No path provided" });
	}

	// Route to different services based on path - using NEXT_PUBLIC_ prefix
	const usersServicePaths = ["auth", "users", "countries", "task", "notifications"];
	const walletsServicePaths = ["wallets", "transactions"];
	const tradingServicePaths = ["account", "trade"];
	const assetsServicePaths = ["signals", "exchanges", "coins", "currencies"];

	let baseUrl: string;

	if (usersServicePaths.some((path) => apiPath.startsWith(path))) {
		baseUrl = process.env.NEXT_PUBLIC_USERS_SERVICE_API_URL || "";
	} else if (walletsServicePaths.some((path) => apiPath.startsWith(path))) {
		baseUrl = process.env.NEXT_PUBLIC_WALLETS_SERVICE_API_URL || "";
	} else if (tradingServicePaths.some((path) => apiPath.startsWith(path))) {
		baseUrl = process.env.NEXT_PUBLIC_TRADING_ENGINE_SERVICE_API_URL || "";
	} else if (assetsServicePaths.some((path) => apiPath.startsWith(path))) {
		baseUrl = process.env.NEXT_PUBLIC_ASSETS_SERVICE_API_URL || "";
	} else {
		return res.status(404).json({ error: "Service not found", path: apiPath });
	}

	// Check if baseUrl is configured
	if (!baseUrl) {
		return res.status(500).json({
			error: "Service URL not configured",
			message: `Backend URL for path "${apiPath}" is not configured`,
			code: "CONFIG_ERROR",
		});
	}

	try {
		// Extract query parameters (excluding the 'path' parameter)
		const queryParams = new URLSearchParams();
		let cookiesFromQuery = "";

		Object.keys(req.query).forEach((key) => {
			if (key !== "path") {
				const value = req.query[key];
				if (key === "_cookies") {
					// Handle cookies from query parameter
					cookiesFromQuery = Array.isArray(value) ? value[0] || "" : value || "";
				} else if (Array.isArray(value)) {
					value.forEach((v) => queryParams.append(key, v));
				} else if (value !== undefined) {
					queryParams.set(key, value);
				}
			}
		});

		// Construct the target URL with query parameters (excluding _cookies)
		let targetUrl = `${baseUrl}/${apiPath}`;
		if (queryParams.toString()) {
			targetUrl += `?${queryParams.toString()}`;
		}

		// Prepare headers for forwarding
		const headers: Record<string, string> = {};

		if (req.body && Object.keys(req.body).length > 0) {
			headers["Content-Type"] = "application/json";
		}

		// Forward authorization header
		if (req.headers.authorization) {
			headers["Authorization"] = req.headers.authorization;
		}

		// Forward other important headers
		if (req.headers["user-agent"]) {
			headers["User-Agent"] = req.headers["user-agent"] as string;
		}

		// Forward cookies - try multiple sources
		if (req.headers.cookie) {
			headers["Cookie"] = req.headers.cookie as string;
			console.log("Using cookies from header:", req.headers.cookie);
		} else if (cookiesFromQuery) {
			headers["Cookie"] = decodeURIComponent(cookiesFromQuery);
			console.log("Using cookies from query param:", decodeURIComponent(cookiesFromQuery));
		} else {
			console.log("No cookies found from any source");
			console.log("Available headers:", Object.keys(req.headers));
			console.log("All header values:", req.headers);
		}

		const response = await fetch(targetUrl, {
			method: req.method,
			headers,
			body:
				req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : undefined,
		});

		const data = await response.json();

		// Add CORS headers
		res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
		res.setHeader("Access-Control-Allow-Credentials", "true"); // Add this

		res.status(response.status).json(data);
	} catch (error: any) {
		console.error("Proxy error:", error);
		console.error("Error details:", {
			message: error.message,
			stack: error.stack,
			name: error.name,
		});

		// Handle specific network errors
		if (error.code === "ENOTFOUND") {
			return res.status(503).json({
				error: "Service temporarily unavailable",
				message: "Backend service is not reachable",
				code: "SERVICE_DOWN",
			});
		}

		if (error.name === "TypeError" && error.message.includes("fetch")) {
			return res.status(503).json({
				error: "Network request failed",
				message: "Unable to reach backend service",
				code: "NETWORK_ERROR",
			});
		}

		res.status(500).json({
			error: "Internal server error",
			message: error.message,
			code: "INTERNAL_ERROR",
		});
	}
}
