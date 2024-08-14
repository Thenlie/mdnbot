import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {languageOptions: { globals: globals.browser }},
  { ignores: ["node_modules/*"] },
  {
    rules: {
      semi: ("error")
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  pluginJs.configs.recommended,
];
