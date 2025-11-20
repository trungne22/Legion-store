const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require("discord.js");

const EMOJI = {
    verify2: "<a:Verify_edited2:1433371443768594493>",
    fire: "<a:__:1440412184139141344>",
    blue: "<a:bluealert:1440412145790750750>",
    verify1: "<a:Verify:1433371517324103780>",
    arrow1: "<a:arrow1:1433374242920992889>",
    black: "<a:black:1440412071115362444>"
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify-panel")
        .setDescription("Gửi bảng Verify Premium"),

    async execute(interaction) {
      
        // Banner Deluxe
        const banner =
            "https://media.discordapp.net/attachments/1428250611262029945/1439883466173845664/Ephoto360.com_169061a88631ea.jpg";

        // Embed Deluxe Style
        const embed = new EmbedBuilder()
            .setColor("#111827") // tone đen-xám premium
            .setTitle(`${EMOJI.fire} 𝗟𝗘𝗚𝗜𝗢𝗡 𝗩𝗘𝗥𝗜𝗙𝗬 — PREMIUM GATEWAY`)
            .setDescription(
                `
${EMOJI.black} **Hệ thống xác minh tự động của *Vortex Legion***  
${EMOJI.arrow1} Giúp đảm bảo an toàn — chống bot — chống tài khoản ảo  
${EMOJI.arrow1} Mở toàn bộ quyền + kênh chat sau khi xác minh  
${EMOJI.arrow1} Hoàn toàn an toàn — không ảnh hưởng tài khoản  

${EMOJI.verify1} **Nhấn nút bên dưới để bắt đầu xác minh**  
                `
            )
            .setImage(banner)
            .setThumbnail(
                interaction.guild.iconURL({ size: 1024 }) ||
                "https://cdn.discordapp.com/embed/avatars/0.png"
            )
            .setFooter({
                text: "LEGION SECURITY SYSTEM • SAFE VERIFY SYSTEM",
                iconURL:
                    "https://cdn-icons-png.flaticon.com/512/190/190411.png"
            })
            .setTimestamp();

        // Buttons Deluxe
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("✔️ Verify Member")
                .setStyle(ButtonStyle.Success)
                .setCustomId("verify_start"),

            new ButtonBuilder()
                .setLabel("⚠️ Tại sao cần verify?")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("verify_why")
        );

        return interaction.reply({
            embeds: [embed],
            components: [buttons]
        });
    }
};
