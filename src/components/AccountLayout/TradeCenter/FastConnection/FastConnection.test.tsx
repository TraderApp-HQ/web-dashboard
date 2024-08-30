import { render, screen } from "@testing-library/react";
import FastConnection from ".";

describe("FastConnection Component", () => {
	it("renders the instructional text and ordered list items", () => {
		render(<FastConnection />);

		expect(screen.getByText(/TraderApp will receive access/i)).toBeInTheDocument();
		expect(screen.getByText("Click the “connect” button")).toBeInTheDocument();
		expect(screen.getByText("Log in to your Binance Account")).toBeInTheDocument();
		expect(screen.getByText("Confirm your connection to TraderApp")).toBeInTheDocument();
	});

	it("renders the connect button and account creation link", () => {
		render(<FastConnection />);

		expect(screen.getByRole("button", { name: /connect/i })).toBeInTheDocument();
		expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();
		expect(screen.getByText(/Create one now./i)).toBeInTheDocument();
	});

	it("handles the link correctly", () => {
		render(<FastConnection />);
		const link = screen.getByText(/Create one now./i).closest("a");
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", ""); // This would need to change based on actual href.
	});
});
