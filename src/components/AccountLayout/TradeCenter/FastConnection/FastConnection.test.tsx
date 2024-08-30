import { render, screen } from "@testing-library/react";
import FastConnection from ".";

describe("FastConnection Component", () => {
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
