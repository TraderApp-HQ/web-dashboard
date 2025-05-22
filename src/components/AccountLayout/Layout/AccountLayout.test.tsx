import React from "react";
import { render, screen } from "@testing-library/react";
import AccountLayout from "./index";
import { useSideNav } from "~/contexts/NavContext";
import useProtectedRoute from "~/hooks/useProtectedRoute";
import { useRouter } from "next/router";

// Mock the required hooks and context
jest.mock("~/contexts/NavContext");
jest.mock("~/hooks/useProtectedRoute");
jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));
jest.mock("~/components/AccountLayout/SideNav", () => {
	return function MockSideNav() {
		return <div data-testid="mock-sidenav">Mock SideNav</div>;
	};
});
jest.mock("~/components/AccountLayout/TopHeader", () => {
	return function MockTopHeader() {
		return <div data-testid="mock-topheader">Mock TopHeader</div>;
	};
});
jest.mock("~/components/AccountLayout/MobileTopHeader", () => {
	return function MockMobileTopHeader() {
		return <div data-testid="mock-mobiletopheader">Mock MobileTopHeader</div>;
	};
});

describe("AccountLayout", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({ pathname: "/some-path" });
		(useProtectedRoute as jest.Mock).mockReturnValue(undefined);
		(useSideNav as jest.Mock).mockReturnValue({ showSideNav: false, toggleSideNav: jest.fn() });
	});

	it("renders with navigation off-screen on mobile when showSideNav is false", () => {
		(useSideNav as jest.Mock).mockReturnValue({ showSideNav: false, toggleSideNav: jest.fn() });

		render(<AccountLayout>Content</AccountLayout>);

		const navContainer = screen.getByTestId("mock-sidenav").parentElement;

		expect(navContainer).not.toBeNull();
		expect(navContainer).toHaveClass("-translate-x-full");
	});

	it("renders with navigation visible when showSideNav is true", () => {
		(useSideNav as jest.Mock).mockReturnValue({ showSideNav: true, toggleSideNav: jest.fn() });

		render(<AccountLayout>Content</AccountLayout>);

		const navContainer = screen.getByTestId("mock-sidenav").parentElement;

		expect(navContainer).not.toBeNull();
		expect(navContainer).not.toHaveClass("-translate-x-full");
	});

	it("always applies desktop visibility classes for sidebar navigation", () => {
		(useSideNav as jest.Mock).mockReturnValue({ showSideNav: false, toggleSideNav: jest.fn() });

		render(<AccountLayout>Content</AccountLayout>);

		const sideNavContainer = screen.getByTestId("mock-sidenav").parentElement;

		expect(sideNavContainer).not.toBeNull();
		expect(sideNavContainer).toHaveClass("md:block");
	});
});
