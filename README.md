## 專案資訊

- 框架：Next.js
- 套件管理工具：npm
- Node.js 版本：18
- 使用技術：Firebase、Redux

## 專案啟動方式

使用以下指令啟動開發伺服器：

```bash
npm run dev
```

## Ngrok 使用說明

本專案有使用 Ngrok 進行本地伺服器公開，方便進行測試或整合外部服務。請先確保已安裝 Ngrok CLI 工具，並執行下列指令：

```bash
ngrok http 3000
```

> 請依實際 port 或需求調整指令與設定。

- [Ngrok 官方文件](https://ngrok.com/docs/getting-started/)

## VS Code 開發建議設定

專案內提供了一份 VS Code 的範例設定檔 `.vscode/settings.json.example`，可作為個人開發環境的參考：

- 於 Terminal 中專案的根目錄下

```bash
cp .vscode/settings.json.example .vscode/settings.json
```

- 或是手動將結尾的 .example 去除

> 請確保已在 VS Code 中安裝 [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 擴充功能，以支援格式化功能。
