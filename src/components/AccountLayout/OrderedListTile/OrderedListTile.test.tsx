import React from "react";
import { render, screen } from "@testing-library/react";
import OrderedListTile from ".";

describe("OrderedListTile", () => {
	it("renders an ordered list with items", () => {
		const items = ["Item 1", "Item 2", "Item 3"];

		render(<OrderedListTile items={items} />);

		// Check if all items are rendered
		items.forEach((item, index) => {
			expect(screen.getByText(item)).toBeInTheDocument();
			expect(screen.getByText((index + 1).toString())).toBeInTheDocument(); // Check if index is rendered correctly
		});

		// Check if the correct number of list items are present
		const listItems = screen.getAllByRole("listitem");
		expect(listItems).toHaveLength(items.length);
	});

	it("handles an empty list", () => {
		render(<OrderedListTile items={[]} />);

		// Check if no list items are rendered
		const listItems = screen.queryAllByRole("listitem");
		expect(listItems).toHaveLength(0);
	});
});
