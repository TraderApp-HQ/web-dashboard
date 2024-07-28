import { render, screen, waitFor } from "@testing-library/react";
import Component from "../components/Component";
import { server } from "../mocks/server";
import { rest } from "msw";

beforeAll(() => {
	server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays mocked data", async () => {
	render(<Component />);
	const dataElement = await waitFor(() => screen.getByText("mocked data"));
	expect(dataElement).toBeInTheDocument();
});

test("displays changed mocked data", async () => {
	server.use(
		rest.get("/api/data", (req, res, ctx) => {
			return res(ctx.status(200), ctx.json({ data: "changed mocked data" }));
		}),
	);
	render(<Component />);
	const dataElement = await waitFor(() => screen.getByText("changed mocked data"));
	expect(dataElement).toBeInTheDocument();
});

test("handles server error", async () => {
	server.use(
		rest.get("/api/data", (req, res, ctx) => {
			return res(ctx.status(500), ctx.json({ message: "Internal Server Error" }));
		}),
	);

	render(<Component />);
	const errorElement = await waitFor(() => screen.getByText(/Error:/));
	expect(errorElement).toBeInTheDocument();
});
