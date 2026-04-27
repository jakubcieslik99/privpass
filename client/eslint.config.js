import { fileURLToPath } from 'node:url'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import { includeIgnoreFile, fixupConfigRules } from '@eslint/compat'
import stylistic from '@stylistic/eslint-plugin'

const gitignorePath = fileURLToPath(new URL('../.gitignore', import.meta.url))

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  js.configs.recommended,
  tseslint.configs.recommended,
  ...fixupConfigRules(pluginReact.configs.flat.recommended),
  eslintPluginReactHooks.configs.flat.recommended,
  eslintPluginReactRefresh.configs.recommended,
  eslintPluginPrettier,
  includeIgnoreFile(gitignorePath),
  {
    plugins: { '@stylistic': stylistic },
    settings: { react: { version: 'detect' } },
    rules: {
      'no-unused-vars': 'off',
      'no-console': ['error', { allow: ['log', 'info', 'warn', 'error'] }],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],
      '@stylistic/quote-props': ['error', 'consistent'],
      '@stylistic/type-annotation-spacing': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
])
