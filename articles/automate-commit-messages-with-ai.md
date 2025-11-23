---
title: '【業務効率化】もうやめましょうよ〜コミットメッセージ考えるのは'
emoji: '🤖'
type: 'tech'
topics: ['JetBrains', 'AI', 'IntelliJ', '生産性向上', 'Git']
published: true
---

# 【業務効率化】もうやめましょうよ〜コミットメッセージ考えるのは（再載）

github連携をきっかけに、動作確認も兼ねてもともとの記事を再度載せました。🙇

## はじめに

もうやめましょうよ〜！
コミットメッセージ考えるのはやめましょうよ〜！
リソースが勿体無い！！

ワン◯ースのコ◯ー大佐の言葉を借りてみましたが、開発中、以下のような悩みを抱えていませんか。

- 「適切なコミットメッセージが思いつかない」
- 「日本語での表現に悩む」
- 「適切な言い回しが分からない」
- 「細かい修正の説明が面倒」

このような悩みを解決し、より本質的な開発作業に時間を使うため、コミットメッセージの生成をAIに任せる方法を紹介します。
私の場合、IntelliJ IDEAを使用しているため、JetBrains AI Assistantを活用しています。

## AI Assistantとは

JetBrains AI AssistantはIntelliJ IDEAなどのJetBrains IDEに統合されているAI機能です。コード補完、リファクタリング、ドキュメント生成などの機能を提供しており、その中にコミットメッセージ生成機能も含まれています。

## コミットメッセージ生成の手順

1. ツールウィンドウのCommitを選択 ![describe-toolwind-commit-position.png](/images/automate-commit-messages-with-ai/describe-toolwind-commit-position.png)
2. コミットしたいファイルを選択 ![describe-selecting-commit-file.png](/images/automate-commit-messages-with-ai/describe-selecting-commit-file.png)
3. AI Assistantのアイコンをクリック ![describe-ai-assistant-position.png](/images/automate-commit-messages-with-ai/describe-ai-assistant-position.png)
4. 生成されたコミットメッセージを確認 ![describe-confirming-commit-message.png](/images/automate-commit-messages-with-ai/describe-confirming-commit-message.png)
5. コミットを実行 ![describe-click-commit-button.png](/images/automate-commit-messages-with-ai/describe-click-commit-button.png)

## カスタマイズ

ちなみに、私がコミット作業をAIに任せたいと思った理由は、業務効率化だけではありません。もう1つ、大きな理由があります。
それは「カスタマイズ性」です。

たとえば、以下のような希望がありました。

- コミットメッセージの冒頭に「[実装］」や「[修正］」といったプレフィックスを付けたい
- 日本語に統一したい
- 修正した対象や関心事を明確に記載したい

AI Assistantなら、プロンプトを自分好みにカスタマイズので上記の希望が叶うんです！！

以下に、私が作成したプロンプトをご紹介します。

## 作成したプロンプト

```markdown
# コミットメッセージ生成に関する指示

以下のルールに従って、日本語のコミットメッセージを生成してください。

---

## 基本ルール

- **メッセージは日本語で書いてください**
- **コミットメッセージの先頭に、変更の種類に応じたプレフィックス（分類）を付けてください**
- **主語は "変更されたコンポーネントや機能" を意識してください**

---

## プレフィックス一覧（変更種別）

| プレフィックス | 用途                                           | 例                                                |
| -------------- | ---------------------------------------------- | ------------------------------------------------- |
| [実装]         | 新しい機能の追加、ページ追加など               | [実装] ユーザー登録ページを追加                   |
| [修正]         | 振る舞いが変わるようなバグ修正、ロジックの修正 | [修正] フォーム送信時のバリデーションエラーを修正 |
| [リファクタ]   | 振る舞いは変わらないが、コードの整理や最適化   | [リファクタ] ヘッダーコンポーネントの構造を整理   |
| [テスト]       | ユニットテスト・E2Eテストなどの追加や修正      | [テスト] ログイン機能のテストケースを追加         |
| [UI]           | CSSやスタイル調整に関する変更                  | [UI] ボタンのホバー時カラーを変更                 |

---

## その他の指針

- **変更は「コンポーネント単位」「機能単位」で捉えてください。**
  - ✅ _OK: 「〇〇コンポーネントの〜を変更」_
  - ❌ _NG: 「細かい修正をいろいろ」_
- **コミット内容が一目で分かるよう、簡潔で明確な表現にしてください。**
- **不要な情報や主観的な言葉（例：とりあえず、ちょっと）などは避けてください。**
```

## プロンプトの設定方法

1. Intellij IDEAのsettings → tools → AI Assistant → Prompt Libraryを開く ![settings-window.png](/images/automate-commit-messages-with-ai/settings-window.png)
2. Build-In Actions → Commit Message Generationを選択 ![describe-commit-message-generation-potision.png](/images/automate-commit-messages-with-ai/describe-commit-message-generation-potision.png)
3. プロンプトを記入 ![descirbe-prompt-window.png](/images/automate-commit-messages-with-ai/descirbe-prompt-window.png)
4. プロンプトを適用 ![describe-click-prompt-apply-button.png](/images/automate-commit-messages-with-ai/describe-click-prompt-apply-button.png)

## 最後に

生成AIの活用により、コミットメッセージ作成の工数を削減し、本質的な開発作業に、注力できるようになりました。
皆様もぜひ、AI活用による業務効率化をお試しください。

## おまけ

まだ精度が低く時々変なコミットメッセージを生成することがあります。
一番おもろかったのがこちら

[修正］レコメンドAPIで除外IDのロジックを修正し、結果アイテムを統一적으로排除

いや急に韓国語！？
