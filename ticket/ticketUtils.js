const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle ,MessageFlags } = require("discord.js");

const CATEGORY_ID = "1435278537954164756";
const SUPPORT_ROLE_ID = "1434599783217234112";
const POLICY_CHANNEL = "<#1439836900809773159>";

function normalize(str) {
    return str
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

module.exports = {
    async createTicketChannel(interaction, reason) {
        const guild = interaction.guild;
        const user = interaction.user;

        const name = `ticket-${normalize(reason).slice(0, 12)}-${normalize(user.username)}`;

        const existing = guild.channels.cache.find(ch => ch.name === name);
        if (existing) return existing;

        return guild.channels.create({
            name,
            parent: CATEGORY_ID,
            type: ChannelType.GuildText,
            topic: `Ticket | ${user.tag} | Reason: ${reason}`,
            permissionOverwrites: [
                { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                { id: SUPPORT_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }
            ]
        });
    },

    async sendTicketIntro(channel, user, reason) {
        const embed = new EmbedBuilder()
            .setColor("#111111")
            .setAuthor({ name: "🎫 Ticket Hỗ Trợ • Legion Store", iconURL: user.displayAvatarURL() })
            .setDescription(`
> 🧾 **Thông Tin Ticket**
\`\`\`yaml
Người tạo: ${user.tag}
Lý do: ${reason}
Trạng thái: Chờ hỗ trợ...
\`\`\`
⚠️ Vui lòng cung cấp đầy đủ thông tin để được hỗ trợ nhanh hơn.
`)
            .setFooter({ text: "LEGION STORE — Ticket System" })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("close_ticket")
                .setLabel("🔒 Đóng Ticket")
                .setStyle(ButtonStyle.Danger)
        );

        return channel.send({
            content: `${user} <@&${SUPPORT_ROLE_ID}>`,
            embeds: [embed],
            components: [row]
        });
    }
};
