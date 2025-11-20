const {
    SlashCommandBuilder,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("email-guide")
        .setDescription("Gửi hướng dẫn sử dụng email để giữ nick login"),

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
            flags: MessageFlags.Ephemeral
        });
    }

        const embed = new EmbedBuilder()
            .setColor("#5A0D2B")
            .setTitle("<a:nlem:1433371542506705007>  CÁCH SỬ DỤNG EMAIL ĐỂ GIỮ NICK LOGIN")
            .setDescription(
` \`\`\`ANSI
[1;2m[1;37m • Đăng nhập vào tài khoản Gmail mà chúng tôi đã cấp trên ứng dụng Gmail trên điện thoại. Đổi pass mail, thêm sđt chính chủ, gmail chính chủ của bạn vào mail phục hồi + thêm cả Authenticator (2fa)
\`\`\`
\`\`\`ANSI
[1;2m[1;37m • Hãy kiểm tra thường xuyên email của bạn, tránh để xảy ra tình trạng xác minh robot/hệ thống tự động.
\`\`\`
\`\`\`ANSI
[1;2m[1;37m • Nếu bạn gặp phải tình trạng xác minh robot như dưới, vui lòng verify ngay bằng sđt chính chủ (nếu mail ko bị block có thể cứu đc hên xui nhé)
\`\`\`
\`\`\`ANSI
[1;2m[1;31m • Lưu ý: Nếu quá hạn, tài khoản bị khóa do robot sẽ không được bảo hành. Giao mail cho khách là shop không còn trách nhiệm với mail đó nữa — khách buộc phải bảo quản.
\`\`\`
\`\`\`ANSI
[1;2m[1;33m • Chỉ cần giữ mail trong tháng đầu, qua tháng thứ hai không cần log giữ mail nữa.
\`\`\`
`
            )
            .setImage("https://media.discordapp.net/attachments/1418755408113434784/1426627326300524574/image.png?format=webp")
            .setFooter({ text: "Legion Store • Email Protection Guide" })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};
