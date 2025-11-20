const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Kiểm tra độ trễ'),

    async execute(interaction) {
        await interaction.reply('Pong!');
    }
};