module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/method-signature-style': 'off',
    '@typescript-eslint/quotes': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'prefer-const': 'off',
    'no-useless-return': 'off'
  }
}
