module.exports = {
  "extends": [
    // "next/core-web-vitals",
    "cgps",
    "cgps/react",
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
  },
  "rules": {
    "react/react-in-jsx-scope": 0,
    "import/extensions": 0,
  },
  "settings": {
    "react": {
      "version": "detect",
    },
  },
};
