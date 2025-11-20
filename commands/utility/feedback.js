const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    MessageFlags,
} = require("discord.js");
const path = require("path");
const { addFeedback, getDB } = require("../../utils/feedbackDB");

const { feedbackChannel } = require(path.resolve("config.json"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("feedback")
        .setDescription("Gửi feedback đến team hỗ trợ")
        .addStringOption(opt =>
            opt
                .setName("nội_dung")
                .setDescription("Ghi feedback của bạn")
                .setRequired(true)
        ),

    async execute(interaction) {
        const feedback = interaction.options.getString("nội_dung");

        const entry = addFeedback(interaction.user.id, feedback);
        const feedbackId = entry.id.toString().padStart(4, "0");

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.username} (${interaction.user.id})`,
                iconURL: interaction.user.displayAvatarURL({ size: 256 })
            })
            .setTitle(`📝 Feedback #${feedbackId}`)
            .setDescription(`> ${feedback}`)
            .addFields(
                {
                    name: "🧾 Thông tin",
                    value:
                        `👤 **Người gửi:** <@${interaction.user.id}>\n` +
                        `🕒 **Thời gian:** <t:${Math.floor(Date.now()/1000)}:F>`
                }
            )
            .setColor(0x00AEEF)
            .setFooter({ text: "✨ Cảm ơn bạn vì đã đóng góp!" })
            .setTimestamp();

        const channel = await interaction.client.channels.fetch(feedbackChannel);
        const msg = await channel.send({ embeds: [embed] });

        const EMOJI_VERIFY = "1433371517324103780";
        const EMOJI_ASDASD = "1433371183209775154";

            await msg.react(EMOJI_VERIFY);
            await msg.react(EMOJI_ASDASD);


        return interaction.reply({
            content: `🎉 **Feedback #${feedbackId} đã được gửi!** Cảm ơn bạn ❤`,
            flags: MessageFlags.Ephemeral
        });
    }
};
