import { fileURLToPath } from 'node:url'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import { includeIgnoreFile } from '@eslint/compat'
import stylistic from '@stylistic/eslint-plugin'

const gitignorePath = fileURLToPath(new URL('../.gitignore', import.meta.url))

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { files: ['**/*.{js,mjs,cjs,ts}'], languageOptions: { globals: globals.node } },
  js.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginPrettier,
  includeIgnoreFile(gitignorePath),
  {
    plugins: { '@stylistic': stylistic },
    rules: {
      'no-unused-vars': 'off',
      'no-console': ['error', { allow: ['log', 'info', 'warn', 'error'] }],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1 }],
      '@stylistic/quote-props': ['error', 'consistent'],
      '@stylistic/type-annotation-spacing': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
])
