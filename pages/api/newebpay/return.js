export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  export default async function handler(req, res) {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="zh-Hant">
        <head>
          <meta charset="UTF-8" />
          <title>付款完成</title>
        </head>
        <body>
          <script>
            alert("付款成功！返回案件管理頁面");
            window.location.href = "/artworkOrdersManagement/consumerOrdersManagement";
          </script>
        </body>
      </html>
    `);
  }
  