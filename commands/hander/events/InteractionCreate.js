const {
    Events,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    MessageFlags
} = require("discord.js");

const path = require("path");
const ticketUtils = require(path.resolve("ticket/ticketUtils.js"));
const closeTicket = require(path.resolve("ticket/ticketClose.js"));
const { addFeedback } = require(path.resolve("utils/feedbackDB.js"));


const FEEDBACK_LOG_CHANNEL = "1435660590671597578";

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction) { 
   
        try {
            // ==========================
            // 🎟 OPEN TICKET PANEL BUTTON
            // ==========================
            if (interaction.isButton() && interaction.customId === "open_ticket") {
                const modal = new ModalBuilder()
                    .setCustomId("ticket_modal")
                    .setTitle("🎫 Tạo Ticket Hỗ Trợ")
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId("ticket_reason")
                                .setLabel("📌 Vui lòng mô tả vấn đề")
                                .setStyle(TextInputStyle.Paragraph)
                                .setRequired(true)
                                .setPlaceholder("VD: Bust, Setup, Trung Gian, Khiếu nại...")
                        )
                    );

                return interaction.showModal(modal); // ❗ Không dùng deferReply ở đây!
            }

            // ==========================
            // 📩 SUBMIT TICKET MODAL
            // ==========================
            if (interaction.isModalSubmit() && interaction.customId === "ticket_modal") {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });

                const reason = interaction.fields.getTextInputValue("ticket_reason");

                const channel = await ticketUtils.createTicketChannel(interaction, reason);
                await ticketUtils.sendTicketIntro(channel, interaction.user, reason);

                return interaction.editReply({
                    content: `🎉 Ticket của bạn đã được tạo: ${channel}`
                });
            }

            // ==========================
            // ⚙ AUTO CREATE TICKET (TOS BUTTON)
            // ==========================
            if (interaction.isButton() && interaction.customId === "open_ticket_from_tos") {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });

                const reason = "Yêu cầu hỗ trợ từ chính sách bảo hành";
                const channel = await ticketUtils.createTicketChannel(interaction, reason);
                await ticketUtils.sendTicketIntro(channel, interaction.user, reason);

                return interaction.editReply({
                    content: `🎫 Ticket đã được tạo tự động: ${channel}`
                });
            }

            // ==========================
            // ❌ CLOSE TICKET
            // ==========================
            if (interaction.isButton() && interaction.customId === "close_ticket") {
                await closeTicket(interaction); // function tự xử lý deferReply nếu cần
                return;
            }

            // ==========================
            // 📩 SUBMIT FEEDBACK MODAL
            // ==========================
            if (interaction.isModalSubmit() && interaction.customId === "feedbackModal") {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });

                try {
                    const feedbackContent = interaction.fields.getTextInputValue("feedbackInput");

                    // Lưu DB (nếu có)
                    try {
                        await addFeedback(interaction.user.id, feedbackContent);
                    } catch (err) {
                        console.error("Feedback DB Error:", err);
                    }

                    // Gửi log
                    const logChannel = interaction.client.channels.cache.get(FEEDBACK_LOG_CHANNEL);
                    if (logChannel) {
                        await logChannel.send({
                            content: `📝 **Feedback mới từ <@${interaction.user.id}>:**\n> ${feedbackContent}`
                        });
                    }

                    return interaction.editReply({
                        content: "✨ Cảm ơn bạn đã gửi feedback! Chúng mình luôn trân trọng đóng góp của bạn ❤️"
                    });

                } catch (err) {
                    console.error("FEEDBACK SUBMIT ERROR:", err);
                    return interaction.editReply({
                        content: "❌ Đã xảy ra lỗi khi gửi feedback. Vui lòng thử lại!"
                    });
                }
            }

        } catch (error) {
            console.error("🔥 Interaction Error:", error);

            if (!interaction.replied && !interaction.deferred) {
                try {
                    await interaction.reply({
                        content: "⚠️ Đã xảy ra lỗi khi xử lý hành động!",
                        flags: MessageFlags.Ephemeral
                    });
                } catch (e) {
                    console.error("Reply Error:", e);
                }
            }
        }
    }
};
