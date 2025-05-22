/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@rocketseat/eslint-config/node'],
  plugins: ['simple-import-sort'],
  rules: {
    'no-useless-constructor': "off",
    'simple-import-sort/imports': 'error',
    "@typescript-eslint/no-empty-object-type": "off"
  },
}
