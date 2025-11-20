module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        // xử lý button verify
        const verifyButtons = require("./verifyButtons.js");
        await verifyButtons.execute(interaction);

        // xử lý lệnh slash
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (command) await command.execute(interaction);
        }
    }
};
