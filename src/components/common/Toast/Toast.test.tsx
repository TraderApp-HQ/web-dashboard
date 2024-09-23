import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Toast from ".";

describe("Toast Component", () => {
	it("renders the Toast with the success type and filled variant", () => {
		render(
			<Toast
				type="success"
				variant="filled"
				title="Success!"
				message="Operation completed successfully"
			/>,
		);

		// Check if the title and message are rendered correctly
		expect(screen.getByText("Success!")).toBeInTheDocument();
		expect(screen.getByText("Operation completed successfully")).toBeInTheDocument();

		// Check if the success icon is rendered
		expect(screen.getByTestId("toast-message")).toHaveClass("bg-success-light");
	});

	it("renders the Toast with the info type and outlined variant", () => {
		render(
			<Toast
				type="info"
				variant="outlined"
				title="Information"
				message="Here is some info for you."
			/>,
		);

		// Check if the title and message are rendered correctly
		expect(screen.getByText("Information")).toBeInTheDocument();
		expect(screen.getByText("Here is some info for you.")).toBeInTheDocument();

		// Check if the outlined style is applied
		expect(screen.getByTestId("toast-message")).toHaveClass("bg-transparent");
	});

	it("hides the Toast when the close button is clicked", () => {
		render(<Toast type="error" title="Error!" message="Something went wrong." />);

		// Check if the toast is initially visible
		expect(screen.getByTestId("toast-message")).toBeVisible();

		// Simulate clicking the close button
		fireEvent.click(screen.getByRole("button"));

		// Check if the toast is hidden
		expect(screen.getByTestId("toast-message")).toHaveClass("hidden");
	});

	it("auto-vanishes the Toast after the specified timeout", async () => {
		render(<Toast type="warning" title="Warning!" autoVanish autoVanishTimeout={1} />);

		// Check if the toast is initially visible
		expect(screen.getByTestId("toast-message")).toBeVisible();

		// Wait for the toast to disappear after 1 second
		await waitFor(() => expect(screen.getByTestId("toast-message")).toHaveClass("hidden"), {
			timeout: 1500,
		});
	});

	it("does not auto-vanish if autoVanish is not set", async () => {
		render(<Toast type="success" title="Success!" message="Will not vanish automatically." />);

		// Check if the toast is visible after some time
		await waitFor(() => expect(screen.getByTestId("toast-message")).toBeVisible(), {
			timeout: 1500,
		});
	});
});
