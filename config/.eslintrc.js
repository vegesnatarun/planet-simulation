import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import ts from 'typescript-eslint';

export default defineConfig(
    globalIgnores([ '/*.js', 'node_modules/**/*.js', 'node_modules/**/*.ts', 'dist/**/*.js']),
    js.configs.recommended,
    ts.configs.recommended,
    {
        'languageOptions': {
            'ecmaVersion': 'latest',
            'sourceType': 'module',
            'globals': {
                ...globals.browser,
                ...globals.node,
            },
        },
        'rules': {
            'indent': [
                'warn',
                4
            ],
            'linebreak-style': [
                'warn',
                'unix'
            ],
            'quotes': [
                'warn',
                'single'
            ],
            'semi': [
                'warn',
                'always'
            ],
            'no-console': [
                'warn'
            ],
            'curly': [
                'warn'
            ],
        },
    }
);
