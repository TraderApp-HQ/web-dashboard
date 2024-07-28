// module.exports = {
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
//   testPathIgnorePatterns: ['/node_modules/', '/.next/'],
//   moduleNameMapper: {
//     '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
//   },
// };

const nextJest = require("next/jest");

const createJestConfig = nextJest({
	dir: "./",
});

const customJestConfig = {
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	testPathIgnorePatterns: ["/node_modules/", "/.next/"],
	testEnvironment: "jest-environment-jsdom",
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
		"^@/(.*)$": "<rootDir>/src/$1", // Handles path aliases starting with '@'
	},
	moduleDirectories: ["node_modules", "<rootDir>/src"],
};

module.exports = createJestConfig(customJestConfig);
