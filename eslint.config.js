import tseslint from 'typescript-eslint';
import pluginAstro from 'eslint-plugin-astro';
import pluginReact from 'eslint-plugin-react';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import astroParser from 'astro-eslint-parser';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/', '.astro/', 'public/'] },
  ...pluginAstro.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
      },
    },
    settings: {
      react: { version: '19' },
    },
    plugins: {
      react: pluginReact,
      'jsx-a11y': pluginJsxA11y,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        extraFileExtensions: ['.astro'],
      },
    },
    plugins: {
      astro: pluginAstro,
    },
    rules: {
      'astro/no-set-html-directive': 'warn',
      'astro/missing-client-only-directive-value': 'warn',
    },
  }
);
