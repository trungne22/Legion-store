const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,   
    Routes
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Xem thông tin của người dùng")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Chọn người dùng (mặc định là bạn)")
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user") || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        let bannerURL = null;
        try {
            const userData = await interaction.client.rest.get(Routes.user(user.id));
            if (userData.banner) {
                bannerURL = `https://cdn.discordapp.com/banners/${user.id}/${userData.banner}?size=4096`;
            }
        } catch (err) {
            console.error("Lỗi khi lấy banner:", err);
        }

        const embed = new EmbedBuilder()
            .setColor("#2F3136")
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ size: 256 }) })
            .setThumbnail(user.displayAvatarURL({ size: 1024 }))
            .setDescription(
                `✨ **Username:** \`${user.username}\`
🆔 **ID:** \`${user.id}\`
📆 **Account Created:** <t:${Math.floor(user.createdTimestamp / 1000)}:R>
${member ? `🎯 **Joined Server:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : ""}`
            )
            .setFooter({ text: `User ID: ${user.id}` });

        if (bannerURL) embed.setImage(bannerURL);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`avatar_${user.id}`)
                .setLabel("Avatar")
                .setEmoji("🖼️")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId(`banner_${user.id}`)
                .setLabel("Banner")
                .setEmoji("🎨")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId(`copyid_${user.id}`)
                .setLabel("Copy ID")
                .setEmoji("📋")
                .setStyle(ButtonStyle.Secondary)
        );

        return interaction.reply({
            embeds: [embed],
            components: [row],
            
        });
    }
};
