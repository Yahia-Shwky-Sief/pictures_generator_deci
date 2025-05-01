import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ESLint compatibility with Next.js rules
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Add Prettier plugin with recommended settings
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': ['error'], // show Prettier issues as ESLint errors
    },
  },

  // Override conflicting ESLint rules
  {
    name: 'Prettier config',
    rules: prettierConfig.rules,
  },
];

export default eslintConfig;
