import "@testing-library/jest-dom";
import "whatwg-fetch";

// jest.setup.ts
import { server } from "./src/mocks/server";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
}));

global.MutationObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	disconnect: jest.fn(),
	takeRecords: jest.fn(() => []),
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
