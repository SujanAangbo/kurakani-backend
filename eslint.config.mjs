import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    rules: {
      "prefer-const": "warn",
      "no-constant-binary-expression": "error",
      "no-unused-vars": "warn",      // Warn when variables are unused
      "no-console": "off",      // Allow console statements (useful in Node.js)
      "semi": ["error", "always"],  // Enforce semicolons
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];
