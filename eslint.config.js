module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ["sonarjs"],
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
    "@vue/typescript/recommended",
    "plugin:sonarjs/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/no-deprecated-slot-attribute": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "error",
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
};
