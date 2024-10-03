import { rest } from "msw";

export const assetServiceHandlers = [
	rest.get(`baseurl/exchanges`, (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				data: [
					{
						displayText: "binance",
						value: "1",
						imgUrl: "binance logo",
					},
					{
						displayText: "kucoin",
						value: "2",
						imgUrl: "kucoin logo",
					},
				],
			}),
		);
	}),
	rest.get(
		`${process.env.NEXT_PUBLIC_USERS_SERVICE_API_URL}/auth/refresh-token`,
		(req, res, ctx) => {
			return res(ctx.status(200), ctx.json("SOMETHING"));
		},
	),
	// Add more handlers as needed
];
