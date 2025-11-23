---
title: 'FSDで始めるフロントエンド設計入門'
emoji: '🏗️'
type: 'tech'
topics: ['フロントエンド', 'アーキテクチャ', 'React', 'TypeScript', 'FSD']
published: true
---

![記事のキャプション画像](/images/fsd-frontend-architecture-guide/fsd-logo.png)

## この記事の対象読者

この記事は、以下のようなほうに向けて書いています。

- フロントエンド開発でコードの整理に悩んでいるほう
- チーム開発でコード配置のルールを統一したいほう
- プロジェクトの保守性・拡張性を高めたいほう
- FSDという言葉は聞いたことがあるが、具体的な使い方がわからないほう

## はじめに

フロントエンド開発をしていると、以下のような悩みに直面したことはありませんか。

- コードがどんどん複雑になって管理が大変。..
- 新しい機能を追加するのに時間がかかる。..
- チームメンバーがコードの場所を探すのに苦労している。..
- ルールが曖昧になりがちで、チームメンバーによって書き方が異なる。..

そんな悩みを解決してくれるのが、**Feature-Sliced Design（FSD）**というアーキテクチャ手法です。

この記事では、フロントエンド初心者でもわかるように、FSDの基本概念から実践的な使い方、注意点、そして私たちのプロジェクトでの実際の活用方法まで詳しく解説します。

## FSDとは何か、なぜ必要なのか

### FSDとは

Feature-Sliced Design（FSD）は、フロントエンドアプリケーションのコードを**役割と責務に基づいて整理する**ためのアーキテクチャ手法です。

### なぜFSDが生まれたのか

従来のフロントエンド開発では、以下のような問題がありました。

- **コードの場所がわからない**:「この機能のコードはどこに書けばいいの？」
- **依存関係が複雑**: ファイルAとファイルBが互いに参照し合う循環参照
- **修正の影響範囲が読めない**: 1つの修正が思わぬところに影響を与える
- **新しいメンバーの学習コストが高い**: プロジェクト固有のルールを覚えるのに時間がかかる

FSDは、これらの問題を**明確なルールと階層構造**で解決します。

## FSDの基本概念

FSDは3つの核となる概念で構成されています。

### 1. Layer（レイヤー）- 影響範囲による分類

![レイヤーの構造図](/images/fsd-frontend-architecture-guide/layer-composition-image.png)

アプリケーションを6つの階層に分けます。

```text
app      # アプリ全体の設定
↑
pages    # 各ページ
↑
widgets  # 複数の機能(shared, entities, features)を組み合わせた大きなUIブロック
↑
features # 機能単位で完結するUIブロック
↑
entities # ビジネスデータ、ドメインモデル
↑
shared   # 汎用的なコンポーネント・関数
```

**重要なルール**: 上位レイヤーから下位レイヤーへの一方向の依存のみ許可

### 2. Slice（スライス）- ビジネス領域による分割

各レイヤー内でビジネス領域ごとに分割します。

```text
features/
├── user-authentication/  # ユーザー認証に関する機能
├── product-search/       # 商品検索に関する機能
└── shopping-cart/        # ショッピングカートに関する機能
```

### 3. Segment（セグメント）- 技術的目的による分類

各スライス内で技術的な役割ごとに分割します。

```text
features/user-authentication/
├── ui/       # UIコンポーネント
├── api/      # API通信
├── model/    # 状態管理・型定義
└── index.ts  # 公開API
```

## 具体的なディレクトリー構造

実際のプロジェクトでは以下のような構造になります。

```text
src/
├── app/                    # アプリケーション設定
│   ├── providers/          # Reactコンテキストプロバイダー
│   ├── routes/             # ルーティング設定
│   └── index.tsx           # エントリーポイント
├── pages/                  # ページコンポーネント
│   ├── home/
│   │   ├── ui/
│   │   ├── libs/
│   │   ├── constants/
│   │   └── index.ts
│   └── product-detail/
│       ├── ui/
│       └── index.ts
├── widgets/                # 大きなUIブロック
│   ├── product-list/
│   │   ├── ui/
│   │   ├── libs/
│   │   ├── constants/
│   │   └── index.ts
│   └── navigation-header/
│       ├── ui/
│       └── index.ts
├── features/               # ユーザー機能
│   ├── product-search/
│   │   ├── ui/
│   │   ├── libs/
│   │   ├── constants/
│   │   └── index.ts
│   └── add-to-cart/
│       ├── ui/
│       └── index.ts
├── entities/               # ビジネスエンティティ
│   ├── user/
│   │   ├── model/
│   │   ├── api/
│   │   └── index.ts
│   └── product/
│       ├── model/
│       ├── api/
│       └── index.ts
└── shared/                 # 共通コンポーネント・関数
    ├── ui/
    │   ├── Button.tsx
    │   └── TextInput.tsx
    └── lib/
        ├── apiClient.ts
        └── formatDate.ts
```

## 各レイヤーの役割を詳しく解説

### shared（共有）

**役割**: プロジェクト全体で使える汎用的なコード

**含めるもの**:

- 基本的なUIコンポーネント（Button、TextInput等）
- ユーティリティー関数（日付フォーマット、バリデーション等）
- API通信の基盤
- 定数

**例**:

```typescript
// shared/ui/Button/Button.tsx
export const Button = ({ children, onClick, variant = 'primary', type = 'button' }) => (
  <button type={type} className={`btn btn-${variant}`} onClick={onClick}>
    {children}
  </button>
)

// shared/lib/apiClient.ts
export const apiClient = async (endpoint: string, options = {}) => {
  const response = await fetch(endpoint, options)
  return response.json()
}
```

### entities（エンティティ）

**役割**: ビジネスデータとその操作

**含めるもの**:

- データの型定義
- API通信関数
- データの変換・バリデーション

**例**:

```typescript
// entities/user/model/types.ts
export interface User {
  id: string
  name: string
  email: string
}

// entities/user/api/userApi.ts
export const userApi = {
  fetchUser: async (id: string): Promise<User> => {
    const response = await fetch(`/api/users/${id}`)
    return response.json()
  },
}

// entities/user/index.ts
export type { User } from './model/types'
export { userApi } from './api/userApi'
```

### features（機能）

**役割**: ユーザーのアクションやビジネス価値をもたらす機能

**含めるもの**:

- フォーム
- 検索
- 認証
- データの追加・更新・削除

**例**:

```typescript
// features/user-login/ui/LoginForm.tsx
import { useState } from 'react'
import { Button, Input } from 'shared/ui'
import { useLoginMutation } from '../model/loginModel'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate: login, isPending } = useLoginMutation()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={email}
        onChange={setEmail}
        placeholder="メールアドレス"
      />
      <Input
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="パスワード"
      />
      <Button type="submit" disabled={isPending}>
        ログイン
      </Button>
    </form>
  )
}
```

### widgets（ウィジェット）

**役割**: 複数の機能やエンティティを組み合わせた大きなUIブロック

**含めるもの**:

- ページの大きな部分（ヘッダー、サイドバー等）
- 複雑なデータ表示コンポーネント

**例**:

```typescript
// widgets/product-search-panel/ui/ProductSearchPanel.tsx
import { ProductSearchForm } from 'features/product-search'
import { ProductFilters } from 'features/product-filters'
import { ProductList } from 'features/product-list'

export const ProductSearchPanel = () => {
  return (
    <div className="search-panel">
      <ProductSearchForm />
      <ProductFilters />
      <ProductList />
    </div>
  )
}
```

### pages（ページ）

**役割**: URLに対応するページ全体

**含めるもの**:

- ページ全体のレイアウト
- データ取得
- エラーハンドリング
- ローディング状態

**例**:

```typescript
// pages/product-detail/ui/ProductDetailPage.tsx
import { useParams } from 'react-router-dom'
import { ProductInfo } from 'widgets/product-info'
import { AddToCartButton } from 'features/add-to-cart'
import { useProductQuery } from '../model/productDetailModel'

export const ProductDetailPage = () => {
  const { id } = useParams()
  const { data: product, isLoading, error } = useProductQuery(id)

  if (isLoading) return <div>読み込み中...</div>
  if (error) return <div>エラーが発生しました</div>
  if (!product) return <div>商品が見つかりません</div>

  return (
    <div>
      <ProductInfo product={product} />
      <AddToCartButton productId={product.id} />
    </div>
  )
}
```

### app（アプリケーション）

**役割**: アプリケーション全体の設定と初期化

**含めるもの**:

- ルーティング設定
- グローバルプロバイダー
- 全体的なスタイル
- 環境設定

**例**:

```typescript
// app/providers/AppProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from 'features/authentication'

const queryClient = new QueryClient()

export const AppProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}

// app/index.tsx
import { AppProvider } from './providers/AppProvider'
import { AppRouter } from './routes/AppRouter'

export const App = () => (
  <AppProvider>
    <AppRouter />
  </AppProvider>
)
```

## Public API の重要性

FSDでは、各スライスは`index.ts`ファイルを通じて外部に公開するものを制御します。

```typescript
// features/user-authentication/index.ts
export { LoginForm } from './ui/LoginForm'
export { useAuth } from './model/authModel'
export type { AuthState } from './model/types'
// 内部実装は公開しない
```

**メリット**:

- 内部実装を隠蔽できる
- リファクタリング時の影響範囲が限定される
- 依存関係が明確になる

## FSDの注意点とよくある間違い

### ❌ よくある間違い

1. **依存関係の逆転**

```typescript
// ❌ 下位レイヤーが上位レイヤーに依存
// entities/user/model/userModel.ts
import { useNavigate } from 'features/navigation' // ダメ！
```

2. **同一レイヤー内での依存**

```typescript
// ❌ 同じレイヤーのスライス同士で依存
// features/user-login/model/loginModel.ts
import { cartModel } from 'features/shopping-cart' // ダメ！
```

3. **sharedレイヤーの肥大化**

```typescript
// ❌ なんでもsharedに入れる
// shared/components/UserLoginForm.tsx // ダメ！ユーザー固有の機能
```

### ✅ 正しいアプローチ

1. **適切な依存関係**

```typescript
// ✅ 上位から下位への依存
// features/user-login/ui/LoginForm.tsx
import { Button } from 'shared/ui/Button' // OK！
import { User } from 'entities/user' // OK！
```

2. **共通処理は上位レイヤーで統合**

```typescript
// ✅ ページレベルで複数の機能を統合
// pages/dashboard/ui/DashboardPage.tsx
import { UserProfile } from 'features/user-profile'
import { ShoppingCart } from 'features/shopping-cart'
```

## 私たちのプロジェクトでの実践

### 採用した理由

1. **チーム開発の効率化**: 新しいメンバーが参加しても「どこに何を書くか」が明確
2. **保守性の向上**: 機能追加・修正時の影響範囲が予測しやすい
3. **テストのしやすさ**: 各レイヤーが独立しているため単体テストが書きやすい

### カスタマイズしたルール

1. **API処理の配置**
   - 原則としてpagesレベルでAPI処理を行う
   - これにより、エラーハンドリングを一箇所に集約できる

2. **UIライブラリーとの併用**
   - デザインシステムを活用することで、sharedとfeaturesの肥大化を防止

3. **widgetsのみサブスライス化許可**
   - widgetsレイヤーのみ、必要に応じてサブスライスを作成可能に
   - widgetsはページを跨いで使われることが少ないため、ページ単位でスライスを作成し、サブスライスは責務ごとに分けることで、管理を容易にし、肥大化を防止

### 導入時の工夫

1. **段階的な導入**: 既存プロジェクトへ一度に適用せず、新機能から段階的に導入
2. **チーム内での勉強会**: FSDの概念をチーム全体で共有
3. **Linter設定**: 依存関係のルール違反を自動検出するよう設定

```json
{
  "rules": {
    "import/no-restricted-paths": [
      "error",
      {
        "zones": [
          {
            "target": "./src/shared",
            "from": [
              "./src/entities",
              "./src/features",
              "./src/widgets",
              "./src/pages",
              "./src/app"
            ]
          },
          {
            "target": "./src/entities",
            "from": [
              "./src/features",
              "./src/widgets",
              "./src/pages",
              "./src/app"
            ]
          }
        ]
      }
    ]
  }
}
```

## 導入のステップ

### Step 1: 小さく始める

- 新しい機能からFSDを適用
- 既存コードは無理に変更しない

### Step 2: チーム内での合意形成

- FSDの概念をチーム内で共有
- プロジェクト固有のルールを決定

### Step 3: ツールの導入

- Linterでルール違反を検出
- ファイルテンプレートの作成

### Step 4: 徐々に適用範囲を拡大

- 新機能開発時にFSD構造を採用
- リファクタリング時に既存コードを移行

## まとめ

FSDは、フロントエンド開発の複雑さを解決するための強力な手法です。

**FSDのメリット**:

- コードの配置場所が明確
- 依存関係がシンプル
- チーム開発がスムーズ
- 保守性・テストのしやすさが向上

**導入時のポイント**:

- 小さく始めて段階的に拡大
- チーム全体での理解と合意が重要
- プロジェクト固有のルールを明文化

FSDには学習コストがありますが、中長期的な開発効率の向上には大きなメリットがあります。特にチーム開発やプロジェクトの長期運用を考えている場合は、導入を検討してみてください。

## 参考リンク

https://feature-sliced.design/

https://github.com/feature-sliced/documentation
