import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";


export default defineConfig([
    globalIgnores([
        "**/.expo/**",
        "**/.turbo/**",
        "**/android/**",
        "**/ios/**",
        "**/node_modules/**",
        "**/dist/**",
        "**/.next/**",
        "**/build/**",
        "**/coverage/**",
 
    ]),
    js.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsparser,
            globals: {
                ...globals.browser,
                ...globals.node,
                __DEV__: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            "no-unused-vars": "warn",
            "no-console": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            
        },
    },
    {
        
        files: ["**/*.config.js", "**/*.config.cjs", "**/*.config.mjs"],
        languageOptions: {
            globals: globals.node,
        },
        rules: {
            "no-undef": "off", 
        },
    },
    {
        files: ["**/.rnstorybook/**/*.ts", "**/.storybook/**/*.ts"],
        rules: {
            "@typescript-eslint/no-require-imports": "off",
        },
    },
]);