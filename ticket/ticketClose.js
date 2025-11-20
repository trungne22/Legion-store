const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require("discord.js");

const Founder = "1403207124196130917"; // ROLE FOUNDER 

module.exports = async function (interaction) { 
    // ============================
    // ❌ Anti non-staff
    // ============================
    if (!interaction.member.roles.cache.has(Founder)) {
        return interaction.reply({
            content: "🚫 Bạn không có quyền đóng ticket này.",
            flags: MessageFlags.Ephemeral
        });
    }

    // ============================
    // 🔔 Confirm UI
    // ============================
    await interaction.reply({
        flags: MessageFlags.Ephemeral,
        embeds: [
            new EmbedBuilder()
                .setColor("#ff4444")
                .setTitle("⚠️ Xác nhận đóng ticket")
                .setDescription("Bạn có muốn **xóa vĩnh viễn ticket** này không?\nHành động này không thể hoàn tác!")
                .setFooter({ text: "Legion Store • Ticket System" })
        ],
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("ticket_close_confirm")
                    .setLabel("🔐 Đóng Ticket")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId("ticket_close_cancel")
                    .setLabel("❌ Hủy")
                    .setStyle(ButtonStyle.Secondary)
            )
        ]
    });

    // ============================
    // 🔍 Collector
    // ============================
    const collector = interaction.channel.createMessageComponentCollector({
        filter: i =>
            ["ticket_close_confirm", "ticket_close_cancel"].includes(i.customId) &&
            i.member.roles.cache.has(Founder), // Only staff can confirm/cancel
        time: 15000
    });

    collector.on("collect", async btn => {
        if (btn.customId === "ticket_close_confirm") {
            await btn.update({
                content: "🔒 Ticket sẽ bị xóa trong 3 giây...",
                embeds: [],
                components: []
            });

            setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
            collector.stop();
            return;
        }

        if (btn.customId === "ticket_close_cancel") {
            await btn.update({
                content: "❎ Hủy đóng ticket.",
                embeds: [],
                components: []
            });

            collector.stop();
            return;
        }
    });

    collector.on("end", async (_, reason) => {
        if (reason === "time") {
            interaction.editReply({
                content: "⌛ Hết thời gian xác nhận — ticket vẫn mở.",
                embeds: [],
                components: []
            }).catch(() => {});
        }
    });
};
