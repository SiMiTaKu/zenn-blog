---
title: 'Reactの肥大化デブページコンポーネントをカスタムフックでダイエットに成功した話'
emoji: '🪝'
type: 'tech'
topics: ['react', 'hooks', 'custom-hooks', 'refactor', 'frontend']
published: true
---

Reactで開発しているそこのあなた、こんな悩みありませんか？

- ページコンポーネントがいつの間にか300行を超えている
- API呼び出しやドメインロジック、状態管理が混ざって、何がどこにあるのか分からない
- UI修正のついでにロジックまで触ってしまい、怖い

そんなあなたの悩みを解決してくれるのが、カスタムフックで関心事を分離することです。

ページコンポーネントに記載するロジックが減ることで、UIが読みやすくなり、変更の影響範囲が狭くなります。
結果として、開発のスピードと安心感が両方上がります。

以下は、実案件をもとに「そのまま転用できるサンプル」に置き換えた例です。

## 結論: カスタムフックで「読む場所」を減らす

「ページはUI、ロジックはフック」に切り分けると、どこを読めばいいかが明確になり、迷子になりません。
UIとロジックの変更が分離されるので、UI修正のついでにロジックを触ってしまうリスクも減ります。

## 理由: 1ファイルに詰め込むと責務が拡散する

コンポーネントが肥大化すると、次のような状態になりがちです。

- API呼び出しが複数あり、依存関係が見えない
- ドメインロジックや状態管理が混ざって、UIのコードと入り乱れる
- UIと関係ない処理が混ざって、修正のたびにファイルの上下を行き来する必要がある

こうなると「何をどこで直せばよいか」が把握しにくくなります。

## 具体例: 修正前と修正後の差

### 修正前: 1ファイルに全部入っている

読みにくいため、日本語でコメントを入れていますが、それでも情報量が多い印象です。

```typescript
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { productApi } from '@/entities/product'
import { Pagination } from '@/shared/ui/pagination'
import { SearchForm } from '@/shared/ui/searchForm'
import { SearchResult } from '@/shared/ui/searchResult'

const DEFAULT_PAGE = 1
const ITEMS_PER_PAGE = 30

export const ProductSearchPage = () => {
  /** クエリパラメーターの管理とURL同期 */
  const [searchParams, setSearchParams] = useSearchParams()
  /** フィルターの状態管理 */
  const [filters, setFilters] = useState<{ keyword: string } | undefined>(() => {
    const keyword = searchParams.get('keyword') ?? ''
    const page = Number(searchParams.get('page') ?? DEFAULT_PAGE)
    return { keyword, page }
  })
  /** レポートダウンロードの状態管理 */
  const [reportId, setReportId] = useState<string | undefined>(undefined)
  /** 初回マウント時のURLクエリパラメーターの正規化 */
  const isInitialMountRef = useRef(true)

  /** 初回マウント時にURLクエリパラメーターを正規化する */
  useEffect(() => {
    if (!isInitialMountRef.current) return
    isInitialMountRef.current = false

    const keyword = searchParams.get('keyword') ?? ''
    const page = Number(searchParams.get('page') ?? DEFAULT_PAGE)
    setSearchParams({ keyword, page: page.toString() }, { replace: true })
  }, [searchParams, setSearchParams])

  const productResponse = productApi.useSearchProducts(filters)
  const reportResponse = productApi.useGetReportUrl(reportId)

  /** レポートURLの取得に成功したら新しいタブで開く */
  useEffect(() => {
    if (reportResponse.status === 'success') {
      window.open(reportResponse.data.url)
      setReportId(undefined)
    }
  }, [reportResponse, setReportId])

  /** フィルターの変更に応じたページネーションと表示データの計算 */
  const { paginated, totalPages } = useMemo(() => {
    if (productResponse.status !== 'success' || !filters)
      return { paginated: [], totalPages: 0 }

    const totalPages = Math.ceil(productResponse.data.length / ITEMS_PER_PAGE)
    const start = (filters.page - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE

    return {
      totalPages,
      paginated: productResponse.data.slice(start, end),
    }
  }, [productResponse, filters])

  /** 検索キーワードの変更とページの変更のハンドラー */
  const handleSearch = (keyword: string) => {
    setFilters({ keyword, page: DEFAULT_PAGE })
    setSearchParams({ keyword, page: DEFAULT_PAGE.toString() })
  }

  /** ページ変更のハンドラー */
  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', page.toString())
      return next
    })
  }

  /** uiの描画 */
  return (
    <article>
      <SearchForm onSubmit={handleSearch} />
      <SearchResult
        items={paginated}
        onDownload={(id) => setReportId(id)}
      />
      <Pagination
        currentPage={filters?.page ?? DEFAULT_PAGE}
        totalPage={totalPages}
        onPageChange={handlePageChange}
      />
    </article>
  )
}
```

読むべき情報が多く、UIの修正が目的でもロジックを追う必要があります。

### 修正後: ロジックをカスタムフックへ移譲

先ほどに比べて、UIのコードがすっきりしている印象です。

```typescript
import { useState } from 'react'
import { Pagination } from '@/shared/ui/pagination'
import { SearchForm } from '@/shared/ui/searchForm'
import { SearchResult } from '@/shared/ui/searchResult'
import { useProductSearchResult } from './hooks/useProductSearchResult'
import { useReportDownload } from './hooks/useReportDownload'
import { useSearchParamValue } from './hooks/useSearchParamValue'

const MIN_PAGES_FOR_PAGINATION = 2

export const ProductSearchPage = () => {
  /** 検索条件のURL同期と管理 */
  const { searchParamValue, onSearch, onPageChange } = useSearchParamValue()
  /** 検索結果の取得とページネーションのロジック */
  const searchResult = useProductSearchResult(searchParamValue)
  /** レポートダウンロードのロジック */
  const { downloadingId, onDownload } = useReportDownload()
  /** ダウンロードしたレポートのID管理 */
  const [submittedIds, setSubmittedIds] = useState<string[]>([])

  /** エラー時の表示 */
  if (searchResult.status === 'error') {
    return <p>検索に失敗しました</p>
  }

  /** uiの描画 */
  return (
    <article>
      <SearchForm onSubmit={onSearch} />
      {searchResult.status === 'loading' && <p>読み込み中</p>}
      {searchResult.status === 'success' && (
        <>
          <SearchResult
            items={searchResult.paginatedData}
            onDownload={onDownload}
            downloadingId={downloadingId}
            onSubmitIds={setSubmittedIds}
          />
          {searchResult.totalPages >= MIN_PAGES_FOR_PAGINATION && (
            <Pagination
              currentPage={searchParamValue?.page ?? 1}
              totalPage={searchResult.totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </article>
  )
}
```

ページは表示制御に集中し、ロジックはフックで完結します。

## フック側のイメージ

ポイントは「ページが欲しい形で返す」ことです。

```typescript
import { useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router'

const DEFAULT_PAGE = 1

export type SearchParamValue = { keyword: string; page: number }

export const useSearchParamValue = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const isInitialMountRef = useRef(true)

  const parsed = useMemo(() => {
    const keyword = searchParams.get('keyword') ?? ''
    const page = Number(searchParams.get('page') ?? DEFAULT_PAGE)
    return { keyword, page }
  }, [searchParams])

  useEffect(() => {
    if (!isInitialMountRef.current) return
    isInitialMountRef.current = false

    setSearchParams(
      {
        keyword: parsed.keyword,
        page: parsed.page.toString(),
      },
      { replace: true }
    )
  }, [parsed, setSearchParams])

  const onSearch = (keyword: string) => {
    setSearchParams(
      {
        keyword,
        page: DEFAULT_PAGE.toString(),
      },
      { replace: true }
    )
  }

  const onPageChange = (page: number) => {
    setSearchParams(
      {
        keyword: parsed.keyword,
        page: page.toString(),
      },
      { replace: true }
    )
  }

  return { searchParamValue: parsed, onSearch, onPageChange }
}
```

ロジックがページから消えるだけで、読みやすさが大きく変わります。

## 効果: 体感できる3つのメリット

- ページが短くなるので、UI修正が速い
- ロジックの場所が明確になり、引き継ぎが楽
- 依存関係が見えて、テストや修正の怖さが減る

「検索まわりを触るならこのフックだけ」と判断できるのが、
地味ですが強力でした。

## 失敗しやすいポイントと対策

- 分割しすぎて、どこにあるか分からなくなる
- 戻り値が抽象的で、ページ側の読解が増える

対策はシンプルです。

- フックは必ず責務ごとに分ける（例：URL同期、API呼び出し、ドメインロジックなど）
- ページが欲しい形で返す
- `status` と `data` のように読みやすい返り値にする

## まとめ

Reactのページが肥大化してきたら、
「UIとロジックを分ける」を合図にカスタムフックを検討すると、
見通しが良くなり、開発の体験が改善します。

もし「最近ページが太ったな」と感じたら、
まずはURL同期やページネーションなど、
画面から一歩離れたロジックをフックに逃がすのがおすすめです。
