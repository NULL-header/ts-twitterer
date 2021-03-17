module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["./tests"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.mjs$": "babel-jest",
  },
  moduleDirectories: ["node_modules", __dirname],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json",
      diagnostics: true,
    },
  },
  moduleNameMapper: {
    "^frontend/(.*)$": "<rootDir>/src/frontend/$1",
    "^backend/(.*)$": "<rootDir>/src/backend/$1",
  },
  verbose: true,
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!node-fetch-cookies)"],
};
