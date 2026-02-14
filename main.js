require('dotenv').config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// 1. 创建 SMTP 传输器 (完全对应你截图中的 Zoho 配置)
const transporter = nodemailer.createTransport({
  host: "smtppro.zoho.com", // Zoho 提供的主机名
  port: 465,                // 推荐使用 465 端口
  secure: true,             // true 对应 465 端口 (SSL); 如果用 587 端口则填 false (TLS)
  auth: {
    user: process.env.SMTP_USER, // 你的登录用户名
    pass: process.env.SMTP_PASS, // ⚠️ 请替换为你在 Zoho 安全中心生成的 App Password
  },
});

// 2. 编写发送邮件的异步函数
async function sendEmail() {
  try {
    const htmlContent = fs.readFileSync(
      path.join(__dirname, "main-5.html"),
      "utf-8"
    );

    const maillistContent = fs.readFileSync(
      path.join(__dirname, "maillist-test.txt"), 
      "utf-8"
    );

    const recipients = maillistContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (recipients.length === 0) {
      console.error("❌ 收件人列表为空");
      return;
    }

    console.log(`📧 准备发送给 ${recipients.length} 个收件人`);

    const info = await transporter.sendMail({
      from: '"Agentall Campaign" <admin@agentall.ai>',
      to: "admin@agentall.ai",
      bcc: recipients,
      subject: "Agentall APAC Acceleration Campaign",
      html: htmlContent,
    });

    console.log("✅ 邮件发送成功！");
    console.log("消息 ID: %s", info.messageId);
    console.log(`📬 收件人数量: ${recipients.length}`);
  } catch (error) {
    console.error("❌ 邮件发送失败，错误信息如下:");
    console.error(error);
  }
}

// 3. 执行发送测试
sendEmail();