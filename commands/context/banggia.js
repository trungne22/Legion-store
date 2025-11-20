const { ContextMenuCommandBuilder, ApplicationCommandType, MessageFlags } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("User Info")
        .setType(ApplicationCommandType.User),

    async execute(interaction) {
        const user = interaction.targetUser;
        await interaction.reply(`User: **${user.username}**\nID: ${user.id}`);
    }
};
