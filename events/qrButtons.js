const fs = require("fs");
// events/qrbutton.js
const {
    ActionRowBuilder,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    Events,
    MessageFlags,
    AttachmentBuilder
} = require("discord.js");

const revenueManager = require("../utils/revenueManager");
const orderManager = require("../utils/orderManager");
const generateInvoice = require("../utils/generateInvoice");

// ROLES, CHANNELS
const ALLOWED_ROLES = [
    "1403207124196130917", // Founder
    "1427684141423530115", // Staff
    "1416845451549737110", // Assistant
    "1434599783217234112", // Support
    "1429818670070104166", // Royal 
    "1428710426606309498"  // Premium
];
const CHANNEL_PAYMENT_LOG = "1440699678294278186";

// Tag group for large orders
const TAG_IMPORTANT = [
    "1403207124196130917", // Founder
    "1427684141423530115"  // Staff cao
];

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            // only handle Button & Modal Submit
            if (!interaction.isButton() && !interaction.isModalSubmit()) return;

            // check base permission for all actions (copy_stk still allowed for ALLOWED_ROLES)
            const userRoles = interaction.member.roles.cache;
            const hasAnyRole = userRoles.some(r => ALLOWED_ROLES.includes(r.id));
            if (!hasAnyRole) {
                if (!interaction.replied && !interaction.deferred) {
                    return interaction.reply({ content: "❌ Bạn không có quyền sử dụng nút này!", flags: MessageFlags.Ephemeral });
                } else {
                    return interaction.editReply({ content: "❌ Bạn không có quyền sử dụng nút này!" });
                }
            }

            // COPY STK simple
            if (interaction.isButton() && interaction.customId === "copy_stk") {
                const msg = "📋 **STK đã sao chép:** `0329523228`";
                if (!interaction.replied && !interaction.deferred) return interaction.reply({ content: msg, flags: MessageFlags.Ephemeral });
                return interaction.editReply({ content: msg });
            }

            // PAID button -> show modal
            if (interaction.isButton() && interaction.customId === "paid") {
                // require staff roles specifically to proceed (subset)
                const PAID_ROLES = ["1403207124196130917","1427684141423530115","1416845451549737110","1434599783217234112"];
                const canPaid = userRoles.some(r => PAID_ROLES.includes(r.id));
                if (!canPaid) {
                    return interaction.reply({ content: "❌ Bạn không đủ quyền để xác nhận thanh toán!", flags: MessageFlags.Ephemeral });
                }

                // build modal with extra fields incl. customer discord id (optional)
                const modal = new ModalBuilder().setCustomId("confirm_payment_modal").setTitle("Xác nhận thanh toán");

                const tenKH = new TextInputBuilder().setCustomId("ten_khach").setLabel("Tên khách hàng *").setStyle(TextInputStyle.Short).setPlaceholder("Tên discord của khách ").setRequired(true);
                const maDon = new TextInputBuilder().setCustomId("ma_don").setLabel("Mã đơn hàng *").setStyle(TextInputStyle.Short).setPlaceholder("Copy mã đơn hàng ở hoá đơn của khách").setRequired(true);
                const dichVu = new TextInputBuilder().setCustomId("dich_vu").setLabel("Dịch vụ khách mua *").setStyle(TextInputStyle.Short).setPlaceholder("Copy sản phẩm ở hoá đơn của khách").setRequired(true);
                const giaTien = new TextInputBuilder().setCustomId("gia_tien").setLabel("Giá tiền (VNĐ) *").setStyle(TextInputStyle.Short).setPlaceholder("Nhập đúng số tiền sản phẩm ").setRequired(true);
                const discordId = new TextInputBuilder().setCustomId("discord_id").setLabel("Discord ID khách (nếu có)").setStyle(TextInputStyle.Short).setPlaceholder("Dùng lệnh /profile để lấy id").setRequired(false);
                

                modal.addComponents(
                    new ActionRowBuilder().addComponents(tenKH),
                    new ActionRowBuilder().addComponents(maDon),
                    new ActionRowBuilder().addComponents(dichVu),
                    new ActionRowBuilder().addComponents(giaTien),
                    new ActionRowBuilder().addComponents(discordId),
                   
                );

                return interaction.showModal(modal);
            }

            // Handle modal submit
            if (interaction.isModalSubmit() && interaction.customId === "confirm_payment_modal") {
                // read fields
                const ten_khach = interaction.fields.getTextInputValue("ten_khach");
                const ma_don = interaction.fields.getTextInputValue("ma_don");
                const dich_vu = interaction.fields.getTextInputValue("dich_vu");
                const gia_raw = interaction.fields.getTextInputValue("gia_tien");
                const discordId = interaction.fields.getTextInputValue("discord_id") || null;
                

                // parse amount
                const gia = parseInt((gia_raw || '').replace(/\D/g,'')) || 0;

                // update revenue & orders
                revenueManager.addRevenue(gia);
                orderManager.createOrUpdateOrder(ma_don, {
                    customer: ten_khach,
                    service: dich_vu,
                    amount: gia,
                    
                    status: "Paid",
                    confirmedBy: interaction.user.id,
                    confirmedAt: new Date().toISOString()
                });

                // generate invoice PDF
                let invoicePath;
                try {
                    invoicePath = await generateInvoice({
                        orderId: ma_don,
                        customerName: ten_khach,
                        service: dich_vu,
                        amount: gia,
                        
                        createdBy: `<@${interaction.user.id}>`
                    });
                } catch (err) {
                    console.error("Invoice generation error:", err);
                }

                // build embed
                const isBig = gia >= 500000;
                const embed = new EmbedBuilder()
                    .setColor(isBig ? 0xFFD43B : 0x00FF7B)
                    .setTitle(isBig ? "⚠️ ĐƠN HÀNG LỚN" : "💸 THANH TOÁN")
                    .addFields(
                        { name: "👤 Khách hàng", value: ten_khach, inline: true },
                        { name: "📦 Mã đơn", value: ma_don, inline: true },
                        { name: "🛒 Dịch vụ", value: dich_vu, inline: true },
                        { name: "💴 Giá tiền", value: `${gia.toLocaleString()} VNĐ`, inline: true },
        
                        { name: "👮‍♂️ Xác nhận bởi", value: `<@${interaction.user.id}>`, inline: true }
                    )
                    .setTimestamp();

                const channel = interaction.client.channels.cache.get(CHANNEL_PAYMENT_LOG);
                if (channel) {
                    // if big order, tag important roles
                    if (isBig) {
                        const tag = TAG_IMPORTANT.map(id => `<@&${id}>`).join(' ');
                        if (invoicePath && fs.existsSync(invoicePath)) {
                            await channel.send({ content: `🚨 ĐƠN LỚN ${tag}`, embeds: [embed], files: [invoicePath] });
                        } else {
                            await channel.send({ content: `🚨 ĐƠN LỚN ${tag}`, embeds: [embed] });
                        }
                    } else {
                        if (invoicePath && fs.existsSync(invoicePath)) {
                            await channel.send({ embeds: [embed], files: [invoicePath] });
                        } else {
                            await channel.send({ embeds: [embed] });
                        }
                    }
                }

// DM khách (nếu có discord id)
if (discordId) {
    try {
        const dmUser = await interaction.client.users.fetch(discordId).catch(() => null);
        if (dmUser) {

            // Lấy thời gian xác nhận đẹp hơn
            const thoi_gian = new Date().toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh"
            });

            const confirmEmbed = new EmbedBuilder()
                .setColor("#8A2BE2")
                .setAuthor({
                    name: "Legion Store • Xác nhận hóa đơn",
                    iconURL: interaction.guild.iconURL()
                })
                .setDescription(
                    `✨ Xin chào **${ten_khach}**!\n\n` +
                    `Đơn hàng của bạn với mã **\`${ma_don}\`** đã được xác nhận thành công.` +
                    `\nCảm ơn bạn đã tin tưởng mua hàng tại **Legion Store** ❤️`
                )
                .addFields(
                    {
                        name: "📦 Sản phẩm:",
                        value: `\`${dich_vu}\``,
                        inline: false
                    },
                    {
                        name: "🕒 Thời gian xác nhận:",
                        value: `\`${thoi_gian}\``,
                        inline: false
                    },
                    {
                        name: "👤 Nhân viên xử lý:",
                        value: `<@${interaction.user.id}>`,
                        inline: false
                    }
                )
                .setThumbnail(dmUser.displayAvatarURL({ dynamic: true }))
                .setFooter({
                    text: "Legion Store – Trân trọng cảm ơn bạn 💜",
                    iconURL: interaction.guild.iconURL()
                });

            // Gửi DM
            if (invoicePath && fs.existsSync(invoicePath)) {
                await dmUser.send({
                    content: `📄 Hóa đơn của bạn đã sẵn sàng!`,
                    embeds: [confirmEmbed],
                    files: [invoicePath]
                });
            } else {
                await dmUser.send({
                    content: `📄 Hóa đơn của bạn đã sẵn sàng!`,
                    embeds: [confirmEmbed]
                });
            }
        }
    } catch (err) {
        console.warn("Cannot DM customer:", err);
    }
}


                // reply ephemeral to staff
                return interaction.reply({ content: `✔️ Đã xác nhận đơn ${ma_don}. Hoá đơn đã được tạo.`, flags: MessageFlags.Ephemeral });
            }

        } catch (e) {
            console.error("qrbutton execute err:", e);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: "❌ Có lỗi xảy ra, thử lại sau.", flags: MessageFlags.Ephemeral });
            } else {
                try { await interaction.editReply({ content: "❌ Có lỗi xảy ra, thử lại sau." }); } catch {}
            }
        }
    }
};
