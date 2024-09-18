import globals from 'globals';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default [
  js.configs.recommended,
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    braceStyle: '1tbs',
    quoteProps: 'as-needed',
  }),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    ignores: [
      '.vscode',
      './dist',
      './public',
      './vite.config.js',
      './eslint.config.js',
      './postcss.config.js',
    ],
    rules: {
      '@stylistic/max-statements-per-line': ['error', { max: 2 }],
    },
  },
];
