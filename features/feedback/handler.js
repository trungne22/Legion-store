const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("../../config.json");

const DB_PATH = path.join(__dirname, "../../data/feedbackData.json");

// Auto create DB if missing
if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "[]");

module.exports = {
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        // /feedback
        if (interaction.commandName === "feedback") {
            const content = interaction.options.getString("content");
            const channel = await interaction.guild.channels.fetch(config.feedbackChannel).catch(() => null);

            if (!channel)
                return interaction.reply({ content: "❌ Kênh feedback không tồn tại!", flags: MessageFlags.Ephemeral });

            // Embed
            const embed = new EmbedBuilder()
                .setColor("#00FF9D")
                .setTitle("📌 Feedback mới")
                .addFields(
                    { name: "👤 User", value: `${interaction.user.tag} (${interaction.user.id})` },
                    { name: "💬 Nội dung", value: content }
                )
                .setThumbnail(interaction.user.displayAvatarURL())
                .setTimestamp();

            const msg = await channel.send({ embeds: [embed] });

            // Auto React
            await msg.react("⭐");
            await msg.react("🔥");
            await msg.react("👌");

            // Save database
            const db = JSON.parse(fs.readFileSync(DB_PATH));
            db.push({
                messageId: msg.id,
                user: interaction.user.tag,
                userId: interaction.user.id,
                content,
                timestamp: new Date()
            });
            fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

            await interaction.reply({ content: "✅ Feedback đã được gửi!", flags: MessageFlags.Ephemeral });
            return "handled";
        }

        // /feedback_chuan
        if (interaction.commandName === "feedback_chuan") {
            const embed = new EmbedBuilder()
                .setColor("#00FF7F")
                .setTitle("🟢 F33dback Chuẩn")
                .setDescription(
`**/feedback content:** \`[ Ví dụ : Babybanhmjj ]\`

Những L3git Trên Là Real 100%.
Backup Lại Để Khách Có Cho L3git Thì Không Bị Đít Cọt Nó Quét 🐂`
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
            return "handled";
        }
    }
};
