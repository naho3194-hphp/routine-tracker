# ルーティントラッカー

毎日のルーティンを挫折せずこなすためのシンプルなWebアプリ。

## 技術スタック

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Zustand** (状態管理 + localStorage永続化)
- **Framer Motion** (アニメーション)
- **Tabler Icons React** (フラットアイコン)

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000 で起動します。

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx          # フォント・メタ設定
│   ├── page.tsx            # ホーム画面（メインページ）
│   └── globals.css         # グローバルスタイル
├── components/
│   ├── RoutineCard.tsx     # 1枚のルーティンカード
│   ├── StatsGrid.tsx       # 完了数・合計時間
│   ├── CalendarView.tsx    # 月次カレンダー + streak
│   └── CompletionBanner.tsx# 全完了バナー
├── store/
│   └── routineStore.ts     # Zustandストア（localStorageに永続化）
├── types/
│   └── index.ts            # 型定義
└── lib/
    ├── constants.ts        # ルーティン定義
    └── dateUtils.ts        # 日付ヘルパー・streak計算
```

## 実装済み機能

- [x] 4ルーティンのチェック完了（即完了 / 時間記録）
- [x] 完了時のアニメーション（pulse / slide-in）
- [x] 全完了バナー（3秒後フェードアウト）
- [x] streak日数カウント
- [x] 月次カレンダー（全完了・一部完了の可視化）
- [x] localStorage永続化（zustand persist）
- [x] prefers-reduced-motion 対応
- [x] タップターゲット 44px 以上
- [x] PWA manifest

## 今後のロードマップ

- [ ] v1.1: PWA化（next-pwa）、ホーム画面追加
- [ ] v1.2: Supabase Auth + DB、複数デバイス同期
- [ ] v1.3: ルーティンのカスタマイズ（追加・削除・目標時間変更）
- [ ] v2.0: 週次レポート、Web Push通知

## Vercelへのデプロイ

```bash
npx vercel
```

無料プランでそのまま動きます。
