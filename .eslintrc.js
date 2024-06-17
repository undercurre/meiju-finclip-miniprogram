module.exports = {
  root: true,
  plugins: ['prettier'],
  env: {
    node: true,
    browser: true,
    es6: true,
    commonjs: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 'latest',
    allowImportExportEverywhere: false,
  },
  globals: {
    App: true,
    Page: true,
    Component: true,
    Behavior: true,
    wx: true,
    getApp: true,
    getCurrentPages: true,
    Common: true,
    MsgGroup: true,
    ProtocolConn: true,
    ProtocolType: true,
    ProtocolBiz: true,
    ProtocolSecurity: true,
    failCallback: true,
    reject: true,
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'no-debugger': 'warn',
    'no-control-regex': 0,
    semi: 'off',
    quotes: [1, 'single'],
    'no-unused-vars': 1,
    'space-before-function-paren': 0,
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
      },
    ],
    'array-bracket-spacing': [2, 'never'],
    'key-spacing': [2, { beforeColon: false, afterColon: true }],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreStrings: true,
        ignorePattern: '(data=)',
      },
    ],
    'no-extra-semi': 0,
  },
  overrides: [
    {
      files: ['*.wxml'],
      plugins: ['wxml'],
      processor: 'wxml/wxml',
      parser: '@wxml/parser',
      rules: {
        'wxml/quotes': ['warn', 'double'], // dom属性使用双引号
        'wxml/report-wxml-syntax-error': 0, // 语法错误
        /*'wxml/max-len': ['error', 120], // 单行代码长度最长120*/
        'wxml/no-duplicate-attributes': 'error', // 重复属性
        'wxml/no-unexpected-string-bool': 'error', // bool类型传了String
        'wxml/wx-key': 'error', // wx:for必须有wx:key
        'wxml/no-inline-wxs': 'error',
      },
    },
  ],
}
