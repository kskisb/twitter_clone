# Twitter Clone フロントエンド

このフロントエンドは [このリポジトリ](https://github.com/kskisb/rails_api) と連動しています。次の流れでセットアップできます。

## セットアップ

### 依存関係のインストール
```bash
npm install
```

### 環境変数の設定
プロジェクトルート（`twitter-clone/`）に `.env` ファイルを作成し、以下の内容を追加してください：

```env
VITE_APP_API_URL_LOCAL=http://localhost:3000/api/v1
VITE_APP_API_URL=***********
VITE_APP_WS_URL_LOCAL=ws://localhost:3000/cable
VITE_APP_WS_URL=***********
```

### 開発サーバーの起動
```bash
npm run dev
```

## デプロイ
AWS Amplify を使用して簡単にデプロイできます。

## デモ動画
https://github.com/user-attachments/assets/63060cb7-8924-4698-bb87-0d4ee0b3e67f
