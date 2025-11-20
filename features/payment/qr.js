const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const path = require("path");
const { bank } = require(path.resolve("./config/bankConfig.js"));
const { createVietQR } = require(path.resolve("./utils/vietqr.js"));

module.exports = {
    name: "qr",

    parseAmount(raw) {
        raw = raw.toLowerCase().replace(/[^0-9km]/g, "");

        if (raw.endsWith("k")) return Number(raw.replace("k", "")) * 1000;
        if (raw.endsWith("m")) return Number(raw.replace("m", "")) * 1000000;

        return Number(raw);
    },

    async handleMessage(msg) {
        const args = msg.content.split(" ");
        if (!args[1]) return msg.reply("❌ Sai cú pháp. Dùng: `?qr 50k`");

        const amount = this.parseAmount(args[1]);
        if (!amount || isNaN(amount)) return msg.reply("❌ Số tiền không hợp lệ!");

        const content = `PAY-${msg.author.username}`; // Auto dạng nội dung đẹp
        const qrURL = createVietQR(amount, content);

        const embed = new EmbedBuilder()
            .setColor("#ff0055")
            .setTitle("💳 THANH TOÁN QR TỰ ĐỘNG")
            .setDescription(`
> 🔹 **Ngân hàng:** ${bank.bankName}
> 🔹 **Chủ tài khoản:** **${bank.owner}**
> 🔹 **Số tài khoản:** \`${bank.accountNumber}\`
> 🔹 **Số tiền:** \`${amount.toLocaleString()} VND\`

## 📝 Nội dung chuyển khoản:
\`${content}\`

🎯 **Chuyển đúng thông tin để auto duyệt!**
            `)
            .setImage(qrURL)
            .setFooter({ text: "Legion Store - Auto Payment System" })
            .setTimestamp();

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("📋 Sao chép STK")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("copy_stk"),

            new ButtonBuilder()
                .setLabel("⬇ Tải QR")
                .setStyle(ButtonStyle.Link) // <-- FIXED
                .setURL(qrURL),

            new ButtonBuilder()
                .setLabel("✔ Đã thanh toán")
                .setStyle(ButtonStyle.Success)
                .setCustomId("paid")
        );

        return msg.reply({ embeds: [embed], components: [buttons] });
    }
};
