---
title: 'macでターミナルの表示をカスタマイズする'
emoji: '🖥️'
type: 'tech'
topics: ['zsh', 'terminal', 'git', 'mac']
published: true
---

## はじめに

本記事では、mac（zsh）でプロンプトを自分好みにカスタマイズする方法を紹介します。特にGitのブランチ名とステータスを表示する方法に焦点を当てます。

完成するプロンプトのフォーマットは以下のとおりです。

```
{ユーザ名}@ : {ディレクトリ} ({ブランチ名} {gitステータス})
$:
```

視覚的な区別のために色も付けます。

- ユーザー名：ライトグリーン
- ディレクトリ：スカイブルー
- ブランチ名・gitステータス：黄色

## 実装（zsh 用スニペット）

以下を `~/.zshrc` に追記してください。

```zsh
# プロンプトで変数展開を有効にする
setopt PROMPT_SUBST

git_prompt_info() {
  local branch git_state=""
  # git リポジトリ内かどうか確認
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    branch=$(git symbolic-ref --quiet --short HEAD 2>/dev/null || git rev-parse --short HEAD 2>/dev/null)
    local unstaged=0 staged=0
    # ワーキングツリーの未ステージ変更
    git diff --no-ext-diff --quiet --exit-code >/dev/null 2>&1 || unstaged=1
    # ステージ済みの変更
    git diff --no-ext-diff --cached --quiet --exit-code >/dev/null 2>&1 || staged=1
    if [ $unstaged -eq 1 ] && [ $staged -eq 1 ]; then
      git_state='*+'
    elif [ $unstaged -eq 1 ]; then
      git_state='*'
    elif [ $staged -eq 1 ]; then
      git_state='+'
    else
      git_state=''
    fi
    if [ -n "$git_state" ]; then
      echo "(${branch} ${git_state})"
    else
      echo "(${branch})"
    fi
  else
    echo ""
  fi
}

# precmd で毎回プロンプト用の文字列を作る
precmd() {
  GIT_PROMPT="$(git_prompt_info)"
}

# 色指定のマッピング: light green -> green, sky blue -> cyan
# 1行目にユーザ名、ディレクトリ、git情報、2行目にプロンプトを出す
# `@` をユーザ名と同じ色にするため、`%n@` を同じ色の中に含めます。
# また、プロンプト中の `\n` を正しく改行として扱うために ANSI-C quoting を使います。
PROMPT=$'%F{green}%n@%f: %F{cyan}%~%f %F{yellow}${GIT_PROMPT}%f\n$ '
```

### 補足

- 色名はzshの標準色名で指定しています
  - ライトグリーン相当： `green`
  - スカイブルー相当： `cyan`
  - 黄色： `yellow`
- より細かい色調整（明るい緑やRGB指定）が必要な場合は、端末が256色／truecolorをサポートしているか確認し、エスケープシーケンスで指定してください

## 導入手順

1. `~/.zshrc` をバックアップする

```bash
cp ~/.zshrc ~/.zshrc.backup
```

2. 上記スニペットを `~/.zshrc` に追記して保存
3. 設定を反映する

```bash
source ~/.zshrc
```

## 動作確認

- Git管理下のディレクトリーで変更を作り、プロンプトが期待通りになるか確認してください。

例：

```bash
cd path/to/your/repo
echo foo >> README.md        # ワーキングツリーに未ステージ変更
git add README.md           # ステージ済みにすると + が表示される
```

## 元に戻す方法

- 変更が気に入らなければバックアップから復元します。

```bash
mv ~/.zshrc.backup ~/.zshrc
source ~/.zshrc
```

## 参考と注意点

- `PROMPT_SUBST` を使って変数展開を有効にしているため、`PROMPT` 内の変数が毎回評価されます。
- `git` コマンドを多用するため、巨大リポジトリーで若干の遅延を感じることがあります。高速化が必要ならgitステータス判定を軽量化する手法（例えばgitstatus / pureなどの導入）を検討してください。

以上です。必要であればこの記事を既存記事群に合わせて整形（文体や文量の調整）します。

## まとめ

macのzshターミナルでプロンプトをカスタマイズする方法を紹介しました。Gitのブランチ名とステータスを表示することで、開発作業がより効率的になります。ぜひ試してみてください。
