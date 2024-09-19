import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputField from ".";

describe("InputField Component", () => {
	test("renders InputField with placeholder text", () => {
		render(<InputField type="text" placeholder="Enter email" />);
		const placeholder = screen.getByPlaceholderText("Enter email");
		expect(placeholder).toBeInTheDocument();
	});

	test("renders InputField with input value", () => {
		render(<InputField type="text" value="input field text" />);
		const inputFieldText = screen.getByDisplayValue("input field text");
		expect(inputFieldText).toBeInTheDocument();
	});

	test("accepts space in input while typing", async () => {
		render(<InputField type="text" placeholder="Type in something" />);
		await userEvent.type(screen.getByPlaceholderText("Type in something"), "typed in text ");
		const inputFieldText: HTMLInputElement = await screen.findByDisplayValue("typed in text");
		expect(inputFieldText.value).toBe("typed in text ");
	});
});
