# tRPC Quickstart

此專案演示:
- 拿取使用者資料使用 `query`、`query stream`、`subscription` 三種方式。
- 建立聊天室使用 `websocket`。

## Quickstart

```bash
$ npm install
$ npm run dev
```

## Run server

```
$ npm run dev:server
```


## Run web

```
$ npm run dev:app
```


## 注意： httpBatchStreamLink 不支援應用層背壓

`httpBatchStreamLink` 只做 HTTP streaming，**不支援 client-to-server 的應用層背壓（backpressure）**。

- server 端只能主動控制傳送速度（例如 sleep），無法根據 client 消費速度自動調整。
- client 端消費太慢時，只會造成本地緩衝區增大，server 不會知道 client 狀態。
- 若需真正的背壓協調，建議改用 WebSocket（`wsLink`）或 gRPC。

參考：
- [tRPC httpBatchStreamLink 官方文件](https://trpc.io/docs/client/links/httpBatchStreamLink)
- [Node.js stream 背壓說明](https://nodejs.org/en/learn/modules/backpressuring-in-streams#backpressuring-in-streams)
