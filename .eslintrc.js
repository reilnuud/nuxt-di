module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    "import/core-modules": ["vuetify", "vuetify/es5/util/colors"],
    "import/resolver": {
      alias: {
        map: [["@", "."]],
        extensions: [".vue", ".js"],
      },
    },
  },
  extends: [
    "plugin:vue/essential",
    "@vue/airbnb",
    "plugin:prettier/recommended",
  ],
  plugins: ["prettier"],
  rules: {
    "arrow-parens": 0,
    "no-extra-parens": "error",
    "prettier/prettier": "error",
    "vue/multi-word-component-names": 0,
    quotes: [2, "double", { avoidEscape: true }],
  },
};
