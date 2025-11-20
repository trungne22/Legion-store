const {
    SlashCommandBuilder,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

const fs = require("fs");
const path = require("path");
const { orderLogChannel, buyerRole } = require(path.resolve("config.json"));

const DB_PATH = path.resolve("data/orders.json");

// =============== TẠO MÃ ĐƠN HÀNG ===============
function generateOrderId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 5; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return `LEGION-${id}`;
}

// =============== LẤY GIỜ VN ===============
function getVietnamTime() {
    return new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("order")
        .setDescription("Tạo hóa đơn cho khách hàng")
        .addUserOption(opt =>
            opt.setName("khách")
                .setDescription("Người mua hàng")
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("sản_phẩm")
                .setDescription("Tên sản phẩm")
                .setRequired(true)
        ),

    async execute(interaction) {

        // ====== CHECK ROLE ======
        const ALLOWED_ROLES = [
            "1403207124196130917", // Founder
            "1427684141423530115", // Staff
            "1434599783217234112", // SUPPORT
            "1416845451549737110"  // ASSITANT
        ];

        const hasRole = interaction.member.roles.cache.some(role =>
            ALLOWED_ROLES.includes(role.id)
        );

        if (!hasRole) {
            return interaction.reply({
                content: "❌ Bạn không có quyền sử dụng lệnh này!",
                flags: MessageFlags.Ephemeral
            });
        }

        // =======================
        // DEFER REPLY
        // =======================
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const user = interaction.options.getUser("khách");
        const product = interaction.options.getString("sản_phẩm");

        const orderId = generateOrderId();
        const timestamp = getVietnamTime();

        // =============== EMBED ===============
        const embed = new EmbedBuilder()
            .setAuthor({
                name: "Legion - Hóa Đơn",
                iconURL: user.displayAvatarURL()
            })
            .setDescription(`Cảm ơn <@${user.id}> đã mua hàng.`)
            .addFields(
                {
                    name: "• Sản phẩm:",
                    value: `\`\`\`\n${product}\n\`\`\``
                },
                {
                    name: "• Mã đơn hàng:",
                    value: `\`\`\`\n${orderId}\n\`\`\``
                },
                {
                    name: "• Đơn hoàn thành lúc:",
                    value: `\`\`\`\n${timestamp}\n\`\`\``
                },
                {
                    name: "Lưu ý:",
                    value: [
                        `1. Vui lòng cho legit ở kênh <#1435660590671597578> 🎉`,
                        `2. Không nhận bảo hành khi mua hàng và rời Discord rồi vào lại`
                    ].join("\n")
                },
                {
                    name: "👤 Người note:",
                    value: `_${interaction.user.username}_`
                }
            )
            .setColor("#8A2BE2")
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: "Legion Store • Cảm ơn bạn đã ủng hộ ❤️" });

        // ======================================================
        // 📌 DATABASE: luôn đảm bảo dạng array để tránh crash
        // ======================================================

        let db = [];

        // Nếu file chưa tồn tại → tạo file mới
        if (!fs.existsSync(DB_PATH)) {
            fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
        }

        // Đọc file
        try {
            const raw = fs.readFileSync(DB_PATH, "utf8");
            const json = JSON.parse(raw);
            if (Array.isArray(json)) {
                db = json;
            } else {
                db = [];  // nếu sai cấu trúc → reset để tránh lỗi
            }
        } catch {
            db = [];
        }

        // Ghi đơn hàng
        db.push({
            id: orderId,
            buyer: user.id,
            product,
            time: timestamp,
            status: "Paid",
            createdBy: interaction.user.id
        });

        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

        // ======================================================
        // DM KHÁCH
        // ======================================================
        try {
            await user.send({ embeds: [embed] });
        } catch {
            await interaction.followUp("⚠️ Không gửi được DM cho khách.");
        }

        // ======================================================
        // LOG CHANNEL
        // ======================================================
        const logChan = interaction.client.channels.cache.get(orderLogChannel);
        if (logChan) logChan.send({ embeds: [embed] });

        // ======================================================
        // GÁN ROLE MUA HÀNG
        // ======================================================
        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.roles.add(buyerRole);
        } catch {
            console.log("Không thể gán role.");
        }

        // =========================== FINAL ===========================
        return interaction.editReply({
            content: `✔️ Đã tạo hóa đơn cho **${user.username}**`
        });
    }
};
