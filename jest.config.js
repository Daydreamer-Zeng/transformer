export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "tsconfig.json"
    }
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json"
      }
    ]
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.[jt]s$": "$1",
    "^@/(.*)(\\.[jt]s)?$": "<rootDir>/src/$1"
  },
  extensionsToTreatAsEsm: [".ts"],
  testMatch: [
    "**/__tests__/**/*.test.[jt]s",
    "**/?(*.)+(spec|test).[jt]s"
  ],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  coveragePathIgnorePatterns: ["/node_modules/", "/__tests__/", "/dist/", "/coverage/"],
  moduleFileExtensions: ["ts", "js", "json", "node"]
}