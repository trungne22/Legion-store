const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { readDB } = require("./feedbackDB");

const BACKUP_DIR = path.join(__dirname, "../data/feedback/backup");
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

function backupFeedback() {
    const data = readDB();
    const filename = `backup-${new Date().toISOString().slice(0,10)}.json`;
    const filepath = path.join(BACKUP_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(`📁 Backup created: ${filename}`);
}

module.exports = {
    backupFeedback,

    data: new SlashCommandBuilder()
        .setName("feedback")
        .setDescription("Gửi feedback")
        .addStringOption(option =>
            option
                .setName("content")
                .setDescription("Nội dung feedback")
                .setRequired(true)
        ),

    async execute() {
        // ✔ Không được xóa, handler cần có
    }
};
