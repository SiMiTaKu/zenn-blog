# GitHub Copilot Instructions

## プロジェクト概要

このリポジトリは、Zenn連携用のブログコンテンツ管理リポジトリです。

技術記事をMarkdown形式で管理し、品質を保つためのLint/フォーマッティングツールを使用しています。

## 技術スタック

- **パッケージ管理**: npm
- **Lint**: textlint (日本語校正)
- **フォーマッター**: Prettier
- **Git Hooks**: husky + lint-staged
- **コンテンツ管理**: Markdown (Zenn連携)

## コーディング規約

### Markdown

- `articles/` ディレクトリ配下に技術記事を配置
  - 将来的にコンテンツのジャンルごとにサブディレクトリを作成する可能性あり
- textlintルールに従った日本語表記を使用
  - TODOコメント禁止
  - 二重助詞の禁止
  - 形式名詞・補助動詞・副詞はひらがな表記
  - 冗長表現・弱い表現の禁止
  - JTF日本語標準スタイルガイド準拠

### コードフォーマット

- シングルクォート使用
- セミコロン省略
- 末尾カンマあり (ES5準拠)
- インデント: スペース2つ
- 最大行幅: 80文字
- アロー関数の引数が1つの場合は括弧省略

## 開発フロー

### セットアップ

```bash
npm install
```

### Lint実行

```bash
npm run lint        # textlintチェック
npm run lint:fix    # textlint自動修正 + Prettier整形
```

### コミット前の自動チェック

pre-commitフックで以下が自動実行されます:

1. セキュリティ脆弱性チェック (`pnpm audit`)
2. ステージングされたMarkdownファイルに対する自動修正 (`lint-staged`)

## ファイル構成

```
/
├── .github/
│   └── copilot-instructions.md  # このファイル
├── .husky/
│   └── pre-commit               # Git pre-commitフック
├── articles/                    # Zenn記事ディレクトリ
├── books/                       # Zenn書籍ディレクトリ
├── .textlintrc.json             # textlint設定
├── .prettierrc.cjs              # Prettier設定
└── package.json                 # プロジェクト設定
```

## GitHub Copilotへの指示

### コード生成時の注意点

- Markdownファイル作成時は必ずtextlintルールに準拠すること
- 日本語の形式名詞・補助動詞・副詞はひらがなで記述
- コード例を含む場合はPrettier設定に従ったフォーマットを使用
- 新規ファイルは `articles/` ディレクトリに配置

### 推奨される動作

- 記事作成後は自動的に `npm run lint:fix` の実行を提案
- package.json編集時はJSON形式の妥当性を確認 (末尾カンマに注意)
- 日本語文章の改善提案を行う際はtextlintルールを参照

### 避けるべき動作

- TODOコメントを含むコードの生成
- 不適切な日本語表現 (冗長表現、弱い表現など)
- JSON末尾カンマなどのフォーマットエラー
