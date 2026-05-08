import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';

export default [
    {
        ignores: ['dist/**', 'node_modules/**', 'db/**'],
    },
    js.configs.recommended,
    {
        files: ['src/**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
                ...globals.es2022,
            },
        },
        plugins: { react: reactPlugin },
        settings: { react: { version: 'detect' } },
        rules: {
            'constructor-super': 'warn',
            'no-const-assign': 'warn',
            'no-this-before-super': 'warn',
            'no-undef': 'warn',
            'no-unreachable': 'warn',
            'no-unused-vars': 'warn',
            'no-extra-semi': 'error',
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'warn',
            'valid-typeof': 'warn',
        },
    },
    {
        files: ['server/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
            },
        },
        rules: {
            'no-undef': 'warn',
            'no-unused-vars': 'warn',
        },
    },
];
