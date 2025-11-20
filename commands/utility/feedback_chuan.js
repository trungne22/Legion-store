const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    MessageFlags
} = require("discord.js");
const { addFeedback } = require("../../utils/feedbackDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("feedback_chuan")
        .setDescription("Gửi feedback theo template"),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId("feedbackModal")
            .setTitle("Gửi Feedback");

        const fbInput = new TextInputBuilder()
            .setCustomId("feedbackInput")
            .setLabel("Nội dung đánh giá")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setPlaceholder("VD: Support nhanh, chất lượng, sẽ ủng hộ tiếp...");

        modal.addComponents(new ActionRowBuilder().addComponents(fbInput));

        return interaction.showModal(modal); // ⛔ PHẢI LÀ CÂU ĐẦU TIÊN
    }
};
