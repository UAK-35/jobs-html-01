/** @format */

import { FlatCompat } from "@eslint/eslintrc";
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import eslint from '@eslint/js';
import globals from "globals";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Translate ESLintRC-style configs into flat configs.
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all
});

export default tseslint.config(
  eslint.configs.recommended,
  prettierRecommended,
  ...tseslint.configs.recommended,
  // {
  //   // ignores: [
  //   //   "src/assets/translations/*",
  //   //   "**/android",
  //   //   "**/ios",
  //   //   "**/package.json",
  //   //   "**/__mocks__",
  //   //   "**/jest-setup",
  //   //   "**/app.json",
  //   //   "**/.eslintrc.js",
  //   //   "**/*.config.js",
  //   //   "**/coverage",
  //   //   "**/schema.graphql",
  //   //   "**/node_modules",
  //   //   "**/*.d.ts",
  //   //   "src/utils/graphql/generated.ts",
  //   //   "src/dev-only-purpose",
  //   //   "**/__generated__",
  //   // ],
  //   ignores: [
  //     // "src/assets/**/*",
  //     "**/package.json",
  //     "**/.eslintrc.js",
  //     "**/*.config.js",
  //     "**/webpack.*",
  //     "**/coverage",
  //     "**/node_modules",
  //     // "**/*.d.ts",
  //     "**/*.mjs",
  //     "src/dev-only-purpose",
  //     "**/__generated__",
  //   ],
  // },
  { files: ["src/**/*.{ts}"] },
  { ignores: ["**/*.mjs", "**/*.config.js", "**/webpack.*"] },
  {
    // files: ['**/*.{js,jsx,ts,tsx}'],
    // files: ['src/**/*.{ts}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'prettier': prettier,
    },
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        // warnOnUnsupportedTypeScriptVersion: false,
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.browser,
      },
    },
    rules: {
      "no-control-regex": "off",
      "no-useless-escape": "off",
      '@typescript-eslint/no-unused-vars': "off",
      '@typescript-eslint/ban-ts-comment': "off"
    },
  },
);
