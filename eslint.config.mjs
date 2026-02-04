import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from 'typescript-eslint';


export default defineConfig(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    globalIgnores([
        "dist/*", // ignore build output
		"node_modules/*", // ignore its content
		"eslint.config.js", // unignore `node_modules/mylibrary` directory
        "jest.config.js", // unignore `node_modules/mylibrary` directory
	]),
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
            },
            parserOptions: {
                allowDefaultProject: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
   
        rules: {
            'no-unused-vars': 'off',
            'no-console': 'off',
            'dot-notation': 'error',
            '@typescript-eslint/no-misused-promises': 'off',
        },
    }
);