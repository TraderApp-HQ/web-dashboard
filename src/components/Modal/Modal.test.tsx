import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal from ".";

// Mock scrollTo (JSDOM doesn't implement it)
Element.prototype.scrollTo = jest.fn();
jest.setTimeout(30000);

describe("Modal Component", () => {
	const mockOnClose = jest.fn();

	const longContent = (
		<div style={{ height: "150vh" }} data-testid="scrollable-content">
			<p>Very long content start</p>
			<p style={{ marginTop: "140vh" }}>Very long content end</p>
		</div>
	);

	const shortContent = (
		<div>
			<p>Short content</p>
		</div>
	);

	beforeEach(() => {
		mockOnClose.mockClear();
		// Reset mocks before each test
		(Element.prototype.scrollTo as jest.Mock).mockClear();
		(global.MutationObserver as jest.Mock).mockClear();
		(global.ResizeObserver as jest.Mock).mockClear();
	});

	it("renders children correctly", () => {
		render(
			<Modal openModal={true} onClose={mockOnClose} title="Test Modal">
				<div>Modal Content</div>
			</Modal>,
		);
		expect(screen.getByText("Modal Content")).toBeInTheDocument();
	});

	it("calls onClose when close button is clicked", () => {
		render(
			<Modal openModal={true} onClose={mockOnClose} title="Test Modal">
				<div>Content</div>
			</Modal>,
		);
		const closeButtonContainer = screen.getByLabelText("close");
		fireEvent.click(closeButtonContainer);
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	describe("Scroll Hint Functionality", () => {
		it("does not show scroll hint when content fits", async () => {
			render(
				<Modal openModal={true} onClose={mockOnClose} title="Test Modal">
					{shortContent}
				</Modal>,
			);

			await waitFor(() => {}, { timeout: 500 });

			expect(screen.queryByLabelText("Scroll to bottom")).not.toBeInTheDocument();
		});

		it("shows scroll hint when content overflows", async () => {
			render(
				<Modal openModal={true} onClose={mockOnClose} title="Test Modal">
					{longContent}
				</Modal>,
			);

			// Mock dimensions AFTER render but BEFORE check
			const scrollableDiv = screen.getByTestId("scrollable-content").parentElement;
			if (scrollableDiv) {
				Object.defineProperty(scrollableDiv, "scrollHeight", {
					configurable: true,
					value: 1000,
				});
				Object.defineProperty(scrollableDiv, "clientHeight", {
					configurable: true,
					value: 500,
				});
				// Manually trigger scroll handler to simulate initial check with mocked values
				fireEvent.scroll(scrollableDiv, { target: { scrollTop: 0 } });
			}

			await waitFor(() => {
				expect(screen.getByLabelText("Scroll to bottom")).toBeInTheDocument();
			});
		});

		it("hides scroll hint when scrolled near the bottom", async () => {
			render(
				<Modal openModal={true} onClose={mockOnClose} title="Test Modal">
					{longContent}
				</Modal>,
			);

			const scrollableDiv = screen.getByTestId("scrollable-content").parentElement;

			// Mock dimensions and trigger initial scroll BEFORE the first waitFor
			if (scrollableDiv) {
				Object.defineProperty(scrollableDiv, "scrollHeight", {
					configurable: true,
					value: 1000,
				});
				Object.defineProperty(scrollableDiv, "clientHeight", {
					configurable: true,
					value: 500,
				});
				fireEvent.scroll(scrollableDiv, { target: { scrollTop: 0 } });
			}

			await waitFor(() => {
				expect(screen.getByLabelText("Scroll to bottom")).toBeInTheDocument();
			});

			// Simulate scrolling close to the bottom
			if (scrollableDiv) {
				fireEvent.scroll(scrollableDiv, { target: { scrollTop: 480 } });
			}

			await waitFor(() => {
				expect(screen.queryByLabelText("Scroll to bottom")).not.toBeInTheDocument();
			});

			// Simulate scrolling to the top
			if (scrollableDiv) {
				fireEvent.scroll(scrollableDiv, { target: { scrollTop: 300 } });
			}

			await waitFor(() => {
				expect(screen.getByLabelText("Scroll to bottom")).toBeInTheDocument();
			});
		});

		it("scrolls to bottom when hint button is clicked", async () => {
			render(
				<Modal openModal={true} onClose={mockOnClose} title="Test Modal">
					{longContent}
				</Modal>,
			);

			const scrollableDiv = screen.getByTestId("scrollable-content").parentElement;

			// Mock dimensions and trigger initial scroll BEFORE the first waitFor
			if (scrollableDiv) {
				Object.defineProperty(scrollableDiv, "scrollHeight", {
					configurable: true,
					value: 1000,
				});
				Object.defineProperty(scrollableDiv, "clientHeight", {
					configurable: true,
					value: 500,
				});
				fireEvent.scroll(scrollableDiv, { target: { scrollTop: 0 } });
			}

			await waitFor(() => {
				expect(screen.getByLabelText("Scroll to bottom")).toBeInTheDocument();
			});

			fireEvent.click(screen.getByLabelText("Scroll to bottom"));

			// Check if scrollTo was called correctly
			expect(Element.prototype.scrollTo).toHaveBeenCalledWith({
				top: 1000, // Should match the mocked scrollHeight
				behavior: "smooth",
			});
		});
	});
});
