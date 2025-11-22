# zenn-blog

zenn連携用のブログコンテンツ管理リポジトリです。

# ファイル構成

```
/
├── .github/                    # github関連のコード
├── .husky/
│   └── pre-commit              # Git pre-commitフック
├── contents/                   # Zenn記事ディレクトリ（将来的にサブディレクトリを作成する可能性あり）
├── .textlintrc.json            # textlint設定
├── .prettierrc.cjs             # Prettier設定
└── package.json                # プロジェクト設定
```

# 環境設定

```shell
npm install
```

# Lint実行

```bash
npm run lint        # textlintチェック
npm run lint:fix    # textlint自動修正 + Prettier整形
```
