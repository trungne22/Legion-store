// =============================
//  VERIFY SYSTEM BY LEGION DEV
// =============================
const { Events, EmbedBuilder, MessageFlags } = require("discord.js");

// =============================
//  CONFIG
// =============================
const LOG_CHANNEL = "1440652458870444093";   // Kênh log verify
const ROLE_VERIFY = "1416850630596755509";   // Role add sau khi verify

// EMOJIS
const EMOJI = {
    verify2: "<a:Verify_edited2:1433371443768594493>",
    fire: "<a:__:1440412184139141344>",
    blue: "<a:bluealert:1440412145790750750>",
    verify1: "<a:Verify:1433371517324103780>",
    arrow1: "<a:arrow1:1433374242920992889>",
    black: "<a:black:1440412071115362444>",
    hello: "<a:_verify:1433371700686487613>"
};

// Chống SPAM 5 giây
const cooldown = new Map();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        if (!interaction.isButton()) return;

        // =============================
        // ANTI-SPAM VERIFY
        // =============================
        if (interaction.customId === "verify_start") {
            const last = cooldown.get(interaction.user.id);
            const now = Date.now();

            if (last && now - last < 5000) {

                // Gửi log spam
                const logC = interaction.guild.channels.cache.get(LOG_CHANNEL);
                if (logC) {
                    logC.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#FFCC00")
                                .setAuthor({
                                    name: "LEGION VERIFY — SPAM DETECTED",
                                    iconURL: interaction.user.displayAvatarURL()
                                })
                                .setDescription(`
⚠️ **Phát hiện người dùng spam verify quá nhanh!**

👤 User: ${interaction.user}
🆔 ID: \`${interaction.user.id}\`
⏳ Cooldown: 5 giây
`)
                                .setTimestamp()
                        ]
                    });
                }

                return interaction.reply({
                    content: "⚠️ Bạn thao tác quá nhanh! Vui lòng chờ **5 giây**.",
                    flags: MessageFlags.Ephemeral
                });
            }

            cooldown.set(interaction.user.id, now);
        }

        // =============================
        // MAIN VERIFY BUTTON
        // =============================
        if (interaction.customId === "verify_start") {
            try {

                // Đảm bảo interaction CHỈ REPLY 1 LẦN
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });

                const member = interaction.guild.members.cache.get(interaction.user.id);

                // Add role
                await member.roles.add(ROLE_VERIFY);

                // Trả lời user
                await interaction.editReply({
                    content: `
${EMOJI.verify1} **Verify thành công!**

${EMOJI.hello} Chào mừng bạn đến với **Vortex Legion – Không Gì Là Không Có**!
🎉 Bạn đã được cấp role: <@&${ROLE_VERIFY}>
                    `
                });

                // Gửi log thành công
                const log = interaction.guild.channels.cache.get(LOG_CHANNEL);
                if (log) {
                    log.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#00FF7B")
                                .setAuthor({
                                    name: "LEGION VERIFY — SUCCESS",
                                    iconURL: "https://cdn-icons-png.flaticon.com/512/190/190411.png"
                                })
                                .setThumbnail(interaction.user.displayAvatarURL())
                                .setDescription(`
${EMOJI.verify2} **Thành viên đã verify thành công**

👤 User: ${interaction.user}
🆔 ID: \`${interaction.user.id}\`
🎖 Role cấp: <@&${ROLE_VERIFY}>
`)
                                .setTimestamp()
                        ]
                    });
                }

            } catch (err) {

                // Gửi lỗi vào log
                const logE = interaction.guild.channels.cache.get(LOG_CHANNEL);
                if (logE) {
                    logE.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#FF0000")
                                .setAuthor({
                                    name: "LEGION VERIFY — ERROR",
                                    iconURL: "https://cdn-icons-png.flaticon.com/512/463/463612.png"
                                })
                                .setDescription(`
❌ **Đã xảy ra lỗi khi verify**

👤 User: ${interaction.user}
🆔 \`${interaction.user.id}\`

**Error:**  
\`\`\`
${err.message}
\`\`\`
`)
                                .setTimestamp()
                        ]
                    });
                }

                // Trả lời user qua editReply
                await interaction.editReply({
                    content: "❌ Đã xảy ra lỗi khi verify! Vui lòng thử lại."
                });
            }

            return;
        }

        // =============================
        // WHY VERIFY BUTTON
        // =============================
        if (interaction.customId === "verify_why") {
            return interaction.reply({
                content: `
${EMOJI.blue} **Tại sao cần Verify?**

${EMOJI.black} **Verify giúp:**
${EMOJI.arrow1} Chặn bot / tài khoản ảo  
${EMOJI.arrow1} Ngăn phá server  
${EMOJI.arrow1} Tăng độ uy tín  
${EMOJI.arrow1} Mở toàn bộ kênh chat  

${EMOJI.verify2} **Hệ thống Verify LEGION**
${EMOJI.arrow1} Tự động & an toàn  
${EMOJI.arrow1} Không lưu dữ liệu người dùng  
${EMOJI.arrow1} Hoạt động 24/7 – bảo mật tuyệt đối  
                `,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
