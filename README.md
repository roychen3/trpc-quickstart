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

## Backpressure Stream API 實作說明

本專案額外實作了 `server/servers/custom-http-server.ts` 以及 `/users/backpressure-stream` API，專門用來演示「應用層背壓（backpressure）」的概念與實踐方式。

### custom-http-server.ts

- 這是一個自訂的 HTTP 伺服器，直接處理 HTTP streaming，繞過 tRPC 預設的 httpBatchStreamLink。
- 主要目的是讓你能夠完全掌控 stream 的傳送時機與資料流速，從而實現「根據 client 消費速度」來調整 server 傳送速度。
- 伺服器會監控 client 的回應（例如 TCP socket 的 drain 事件），只有在 client 準備好接收時才繼續推送資料，這就是所謂的 backpressure 協調。
- 這種設計能有效避免 client 端緩衝區爆滿，並讓 server 端能根據實際消費速度做出調整。

### `/users/backpressure-stream` API

- 這個 API endpoint 會持續推送使用者資料給 client，但會根據 client 的消費速度進行流量控制。
- 若 client 處理速度較慢，server 會自動暫停傳送，等到 client 準備好再繼續。
- 這種方式與單純的 HTTP streaming 最大差異在於：**server 能感知 client 狀態，並做出即時調整**。

#### 使用情境

- 適合需要大量資料、且 client 處理速度不一的場景，例如即時資料分析、長連線推播等。
- 能有效減少記憶體壓力與網路擁塞。

#### 參考

- [自訂 HTTP streaming 與 backpressure 實作範例](server/src/servers/custom-http-server.ts)
