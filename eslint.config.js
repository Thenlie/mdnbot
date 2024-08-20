import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
    { languageOptions: { globals: globals.browser } },
    { ignores: ['node_modules/*'] },
    {
        plugins: {
            prettier: eslintPluginPrettier,
        },
        rules: {
            semi: ['error'],
            'prettier/prettier': 'error',
        },
    },
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    pluginJs.configs.recommended,
];
