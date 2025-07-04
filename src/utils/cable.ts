import { createConsumer } from '@rails/actioncable';

// ActionCableの接続を作成
// 注意: バックエンドのWebSocket URLは環境に合わせて変更する必要があります
// export const cable = createConsumer(import.meta.env.VITE_APP_WS_URL_LOCAL);
export const cable = createConsumer(import.meta.env.VITE_APP_WS_URL);