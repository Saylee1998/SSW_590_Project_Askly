/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    // we’re using plain JS + ESM, no Babel
    transform: {},
  };
  