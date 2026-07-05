# 採用管理システム Ver2

このリポジトリは、GitHub Actions を使って GitHub Pages に静的公開する構成です。

公開時のビルドは不要です。

## デプロイ

GitHub Pages の設定:

- 公開元: `GitHub Actions`

公開対象ファイル:

- `index.html`
- `assets/app.js`
- `styles.css`
- `.nojekyll`

`index.html` は以下でアプリを読み込みます。

```html
<script type="module" src="./assets/app.js"></script>
```

アプリは `assets/app.js` から直接読み込むため、Pages 公開に Vite、pnpm、TypeScript、ESLint は不要です。

デプロイは `.github/workflows/deploy.yml` で実行します。

## 構成

```text
/
 ├─ index.html
 ├─ assets/
 │   └─ app.js
 ├─ styles.css
 ├─ .nojekyll
 └─ README.md
```

## 現在の範囲

- レスポンシブ対応のサイドバー、ヘッダー、メインコンテンツ
- ダッシュボード、応募者、面接、店舗、分析、設定
- 通知、ダークモード切替、プロフィールの表示
- KPIカード
- 応募者一覧、応募者編集モーダル
- 応募媒体別の応募数と採用率
- 404 / 500 表示
- GitHub Pages 用の静的公開

## 注意

現在の画面はプレースホルダーデータで表示しています。データベース連携やバックエンド処理は含めていません。

Supabase 連携と Airwork 連携はまだ追加していません。
