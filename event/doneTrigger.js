const { Events, EmbedBuilder,MessageFlags } = require("discord.js");

const FEEDBACK_CHANNEL = "1435660590671597578"; // ID kênh feedback

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        // Chỉ kích hoạt nếu tin nhắn bắt đầu bằng "done"
        if (!/^done\s+/i.test(message.content)) return;

        const content = message.content.slice(5).trim();
        if (!content) {
            return message.reply("❗ Bạn chưa nhập nội dung sau `done`");
        }

        const embed = new EmbedBuilder()
            .setColor("#FF3333")
            .setAuthor({
                name: "Legion Store - Hoàn tất dịch vụ",
                iconURL: "https://i.imgur.com/7Jvfa8t.png" // icon custom hoặc logo
            })
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`🎉 **Cảm ơn bạn đã sử dụng dịch vụ tại Legion Store!**\nChúng tôi rất vui khi được đồng hành cùng bạn.`)
            .addFields(
                {
                    name: "📌 Dịch vụ đã hoàn thành:",
                    value: `\`\`\`${content}\`\`\``
                },
                {
                    name: "📎 Vui lòng đánh giá tại:",
                    value: `📩 <#${FEEDBACK_CHANNEL}>`
                },
                {
                    name: "📝 Dán đoạn này vào phần đánh giá:",
                    value: `\`\`\`/feedback nội_dung:${content}\`\`\``
                }
            )
            .setFooter({
                text: `Thực hiện bởi: ${message.author.tag} • ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`
            });

        return message.reply({ embeds: [embed] });
    }
};
