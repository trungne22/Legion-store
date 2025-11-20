const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-panel")
    .setDescription("Gửi panel mở ticket hỗ trợ"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("#2B2D31") // Dark Discord style
      .setAuthor({ name: "🎟️ Hỗ Trợ Khách Hàng", iconURL: interaction.client.user.displayAvatarURL() })
      .setDescription(
        `> 💬 Nếu bạn gặp vấn đề hoặc cần hỗ trợ từ **LEGION STORE**, hãy nhấn nút bên dưới!\n` +
        `> 🎯 Hỗ trợ: Nạp | Boost | Trung Gian | Setup | Khác`
      )
      .addFields(
        {
          name: "📌 Lưu ý",
          value:
            `• Một ticket chỉ dành cho 1 vấn đề\n` +
            `• Không ping staff khi không cần thiết\n` +
            `• Ticket sẽ bị xoá nếu spam`
        }
      )
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setFooter({ text: "LEGION STORE Ticket System", iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    const btn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("open_ticket")
        .setLabel("📩 Mở Ticket Hỗ Trợ")
        .setStyle(ButtonStyle.Success)
    );

    await interaction.reply({
      embeds: [embed],
      components: [btn],
      ephemeral: false
    });
  }
};
