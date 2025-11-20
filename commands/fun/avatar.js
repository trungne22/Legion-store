const { SlashCommandBuilder, EmbedBuilder,MessageFlags, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Xem avatar của ai đó 🔍')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Chọn người dùng 👤')
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle( `Avatar của ${user.username}`)
            .setDescription(`📸 Đây là avatar của ${user.username}!`)
            .setImage(avatarURL)
            .setFooter({
                text: `✨ Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};  