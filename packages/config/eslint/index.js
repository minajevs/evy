/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    'next',
    'turbo',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  plugins: ['unused-imports'],
  rules: {
    '@typescript-eslint/require-await': 'warn',
    '@typescript-eslint/no-misused-promises': 'off',
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],
  },
  ignorePatterns: ['**/*.config.js', '**/*.config.cjs', 'packages/config/**'],
  reportUnusedDisableDirectives: true,
}

module.exports = config
