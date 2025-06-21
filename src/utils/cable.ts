import { createConsumer } from '@rails/actioncable';

// ActionCableの接続を作成
// 注意: バックエンドのWebSocket URLは環境に合わせて変更する必要があります
export const cable = createConsumer('ws://localhost:3000/cable');