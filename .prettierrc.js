module.exports = {
  endOfLine: 'auto',
  printWidth: 120,
  eslintIntegration: true,
  singleQuote: true,
  semi: false,
  overrides: [
    {
      files: ['*.wxml'],
      options: {
        parser: 'html',
      },
    },
  ],
}
