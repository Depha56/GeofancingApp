// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
  rules: {
    "import/no-unresolved": [
      2,
      { "caseSensitive": false }
    ]
  }
};
