import { render, screen } from "@testing-library/react";
import React from "react";
import ExchangeTile from ".";

describe("ExchangeTile Component", () => {
	it("renders TraderAppIcon and ConnectionIcon", () => {
		render(<ExchangeTile />);
		expect(screen.getByTestId("trader-app-icon")).toBeInTheDocument();
		expect(screen.getByTestId("connection-icon")).toBeInTheDocument();
	});

	it("renders the Image component when imageUrl is provided", () => {
		const testUrl = "https://example.com/test-image.png";
		render(<ExchangeTile imageUrl={testUrl} />);
		// Find the image by its alt text, which is testUrl in this case
		const imageElement = screen.getByAltText(testUrl);
		expect(imageElement).toBeInTheDocument();
		expect(imageElement).toHaveAttribute("src");
	});

	it("renders the fallback div with 'N/A' when imageUrl is not provided", () => {
		render(<ExchangeTile />);
		const fallbackElement = screen.getByText("N/A");
		expect(fallbackElement).toBeInTheDocument();
	});
});
