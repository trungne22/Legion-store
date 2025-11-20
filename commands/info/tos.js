const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tos")
        .setDescription("Xem chính sách bảo hành & quy định shop"),

    async execute(interaction) {
         // Các role được phép dùng lệnh
    const ALLOWED_ROLES = [
        "1403207124196130917", // Founder
        "1427684141423530115", // Staff
        "1416845451549737110", // Assistant
        "1434599783217234112"  // Support
    ];

    // Kiểm tra user có ít nhất 1 role hợp lệ không
    const hasRole = interaction.member.roles.cache.some(role =>
        ALLOWED_ROLES.includes(role.id)
    );

    if (!hasRole) {
        return interaction.reply({
            content: "❌ Bạn không có quyền sử dụng lệnh này!",
            flags: MessageFlags.Ephemerallags.Ephemeral
        });
    }

        const embed = new EmbedBuilder()
            .setColor("#a970ff")
            .setTitle("📜 CHÍNH SÁCH BẢO HÀNH & QUY ĐỊNH")
            .setURL("https://discord.com/channels/1403204361294712912/1436570173124644985")
            .setDescription(`
**CHUNG**
\`\`\`
-Out Shop Khi Đang Trong Quá Trình Bảo Hành = Huỷ BH
-Bảo hành nếu có +1 legit ở Feedback
-Hoàn tiền 100% lỗi shop
-Hoàn tiền 50% - 70% lỗi khách hàng (tùy xét)
-Các đơn hoàn thành trong 24–72h tùy dịch vụ
-Các tài khoản Gmail cần tự nuôi
-Sản phẩm có lưu ý riêng sẽ được nhắc trước khi thanh toán
-Ưu tiên làm nhanh +15k
\`\`\`

**THANH TOÁN**
\`\`\`
-Ưu tiên thanh toán qua Momo
-Ngân hàng có thể bảo hành nhưng thời gian lâu hơn
-Chỉ nhận thanh toán bằng phương thức chuyển khoản.
-Thanh toán trước khi đặt hàng.
\`\`\`

**SETUP BOT**
\`\`\`
-Bảo hành duy trì = bảo hành full thời gian sử dụng (nếu không vi phạm quy định)
-Không đổi gói / nâng cấp trong khi dùng
-Mỗi tháng đóng phí VPS 45-50k (theo gói)
-Bot sẽ được lưu trữ và backup định kỳ bởi shop
-Không bảo hành do lỗi người dùng
-Không bảo hành khi bot bị ban khỏi server
-Quá hạn đóng VPS 24h → xoá bot. Muốn add lại: phí 100k + tiền VPS tháng.
-Mỗi bot chỉ setup cho 1 server. Muốn chuyển server khác: phí 50% giá trị bot (tuỳ loại).
-Chỉ nhận sửa bot từ chủ bot (người giao dịch với BR Zone)
-Liên hệ ticket nếu lỗi
\`\`\`

**Nitro Login**
\`\`\`
-Bảo hành full thời gian sử dụng nếu tuân thủ điều kiện
-Không đổi gói / nâng cấp trong khi dùng
-Liên hệ ticket trong vòng 24h nếu lỗi
\`\`\`

**Boost Server**
\`\`\`
-Bảo hành 100% trong thời gian sử dụng
-Không được kick hoặc ban acc boost
-Tắt anti-raid khi boost
-Không được xoá kênh welcome vì cần log check
\`\`\`

⚠ **LƯU Ý**
\`\`\`
Nếu ứng dụng thay đổi chính sách = KHÔNG bảo hành
Bảo hành full nghĩa là chính sách không đổi
\`\`\`
            `)
            .setFooter({
                text: `✦ Mua hàng = chấp nhận Rules & Chính Sách mà Sốp đưa ra
✦ Vui lòng đọc kỹ trước khi mua hàng.
✦ Khách hàng là thượng đế
✦ Discord Shop: https://discord.com/channels/1403204361294712912/1436570173124644985`,
            })
        
            .setImage("https://cdn.discordapp.com/attachments/1434057266998280222/1436757283572027545/Ephoto360.com_169061a88631ea.jpg?ex=691d4a3e&is=691bf8be&hm=d0c8090549aeda2586a6167e7359bc908ac8af3f2c17fb4f92bb34af1d53bfd6&");
            
        // ======================
        // BUTTON MỞ TICKET
        // ======================
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("open_ticket_from_tos")
                .setStyle(ButtonStyle.Success)
                .setLabel("🎫 Mở Ticket Hỗ Trợ")
        );

        return interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};
