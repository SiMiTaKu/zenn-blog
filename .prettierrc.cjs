module.exports = {
  overrides: [
    {
      files: [
        '*.ts',
        '*.tsx',
        '*.js',
        '*.jsx',
        '*.mjs',
        '*.cjs',
        '*.css',
        '*.scss',
        '*.less',
        '*.json',
        '*.yml',
        '*.yaml',
        '*.md',
      ],
      options: {
        singleQuote: true, // ダブルクォートの代わりにシングルクォートを使用
        trailingComma: 'es5', // ES5で有効な箇所（オブジェクト、配列）に末尾カンマを追加
        semi: false, // 文末のセミコロンを省略
        arrowParens: 'avoid', // アロー関数の引数が1つの場合は括弧を省略
        printWidth: 80, // 1行の最大文字数を80文字に設定
        tabWidth: 2, // インデントのスペース数を2に設定
        useTabs: false, // タブの代わりにスペースを使用
      },
    },
  ],
}
