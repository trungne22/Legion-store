require("dotenv").config();

const {
    Client,
    Events,
    GatewayIntentBits,
    Collection,
    Partials,
    MessageFlags,
    Routes
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const WELCOM_CHANNEL_ID = `1428304288223854613`

// =========================
// 🔥 BOT CLIENT
// =========================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel]
});

// =========================
// 📌 LOAD SLASH COMMANDS
// =========================
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {
    const categories = fs.readdirSync(commandsPath);

    for (const category of categories) {
        const categoryPath = path.join(commandsPath, category);
        const files = fs.readdirSync(categoryPath).filter(f => f.endsWith(".js"));

        for (const file of files) {
            const command = require(path.join(categoryPath, file));

            if ("data" in command && "execute" in command) {
                client.commands.set(command.data.name, command);
                console.log(`✅ Loaded slash command: ${command.data.name}`);
            } else {
                console.log(`⚠ Missing export in ${file}`);
            }
        }
    }
}

// =========================
// 🎫 LOAD TICKET HANDLER
// =========================
let ticketHandler = null;
const TICKET_PATH = "./commands/hander/events/InteractionCreate.js";
if (fs.existsSync(TICKET_PATH)) {
    ticketHandler = require(TICKET_PATH);
    console.log("🎫 Ticket system loaded!");
} else {
    console.log("⚠ Ticket system not found (optional)");
}

// =========================
// 💳 QR SYSTEM
// =========================
const qrHandler = require("./features/payment/qr.js");
const qrButtonHandler = require("./events/qrButtons.js");

// VERIFY BUTTON HANDLER
const verifyButtons = require("./events/verifyButtons.js");

// =========================
// 🚀 READY
// =========================
client.once(Events.ClientReady, c => {
    console.log(`🔥 BOT ONLINE: ${c.user.tag}`);
});

// =========================
// 🔥 INTERACTION HANDLER
// =========================
const selectHandler = require("./selectHandler.js");

client.on(Events.InteractionCreate, async interaction => {
    try {
        // 👉 Verify button handler trước
        const verifyResult = await verifyButtons.execute(interaction);
        if (verifyResult === "handled") return;

        // 👉 QR Buttons
        if (await qrButtonHandler.execute(interaction) === "handled") return;

        // 👉 Ticket system
        if (ticketHandler) {
            const result = await ticketHandler.execute(interaction);
            if (result === "handled") return;
        }

        // 👉 Slash commands
        if (interaction.isChatInputCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd)
                return interaction.reply({
                    content: "❌ Command không tồn tại!",
                    flags: MessageFlags.Ephemeral
                });

            return cmd.execute(interaction);
        }

        // 👉 Select Menu
        if (interaction.isStringSelectMenu()) {
            return selectHandler(interaction);
        }

        // 👉 Avatar / Banner / CopyID
        if (interaction.isButton()) {
            const [action, userId] = interaction.customId.split("_");
            if (!userId) return;

            if (action === "avatar") {
                const user = await client.users.fetch(userId);
                return interaction.reply({
                    content: `🖼️ ${user.username}:\n${user.displayAvatarURL({ size: 4096 })}`,
                    flags: MessageFlags.Ephemeral
                });
            }

            if (action === "banner") {
                const userData = await client.rest.get(Routes.user(userId));
                if (!userData.banner)
                    return interaction.reply({
                        content: "❌ Không có banner.",
                        flags: MessageFlags.Ephemeral
                    });

                return interaction.reply({
                    content: `🎨 Banner:\nhttps://cdn.discordapp.com/banners/${userId}/${userData.banner}?size=4096`,
                    flags: MessageFlags.Ephemeral
                });
            }

            if (action === "copyid") {
                return interaction.reply({
                    content: `📋 ID: \`${userId}\``,
                    flags: MessageFlags.Ephemeral
                });
            }
        }

    } catch (error) {
        console.error("🔥 Interaction Error:", error);

        // tránh lỗi InteractionAlreadyReplied
        if (!interaction.replied && !interaction.deferred) {
            return interaction.reply({
                content: "⚠ Đã xảy ra lỗi!",
                flags: MessageFlags.Ephemeral
            });
        }
    }
});

// =========================
// 🎯 PREFIX HANDLER (?qr)
// =========================
client.on("messageCreate", msg => {
    if (msg.author.bot) return;
    if (msg.content.startsWith("?qr"))
        return qrHandler.handleMessage(msg);
});

// =========================
// 🟢 DONE TRIGGER
// =========================
const doneTrigger = require("./event/doneTrigger.js");

client.on(Events.MessageCreate, async msg => {
    try {
        await doneTrigger.execute(msg);
    } catch (err) {
        console.error("DoneTrigger error:", err);
    }
});


// =========================
// 🔑 LOGIN
// =========================
client.login(process.env.TOKEN);
