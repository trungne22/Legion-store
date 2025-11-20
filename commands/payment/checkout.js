const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits , MessageFlags} = require("discord.js");
const { generateOrderId, getVietnamTime, saveOrder } = require("../../utils/orderUtils");

const ROLE_BOUGHT = "YOUR_ROLE_ID"; // role "Đã mua hàng"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("checkout")
        .setDescription("Tạo hoá đơn test")
        .addStringOption(o => o.setName("sản-phẩm").setDescription("Tên sản phẩm").setRequired(true))
        .addIntegerOption(o => o.setName("giá").setDescription("Giá tiền").setRequired(true)),

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
        const product = interaction.options.getString("sản-phẩm");
        const price = interaction.options.getInteger("giá");

        const orderId = generateOrderId();
        const time = getVietnamTime();

        const invoice = {
            orderId,
            buyer: interaction.user.id,
            product,
            price,
            time
        };

        saveOrder(invoice);

        // Gửi vào DM
        try {
            const dmEmbed = new EmbedBuilder()
                .setTitle("🧾 HOÁ ĐƠN MUA HÀNG")
                .setDescription(`Cảm ơn bạn đã mua hàng tại **LEGION STORE**!`)
                .addFields(
                    { name: "Mã đơn hàng", value: orderId },
                    { name: "Sản phẩm", value: product },
                    { name: "Giá", value: `${price} VND` },
                    { name: "Thời gian", value: time }
                )
                .setColor("Random")
                .setFooter({ text: "Chúc bạn 1 ngày tốt lành ❤️" });

            await interaction.user.send({ embeds: [dmEmbed] });
        } catch {
            console.log("❌ Không gửi được DM.");
        }

        // Gắn role
        const member = await interaction.guild.members.fetch(interaction.user.id);
        if (!member.roles.cache.has(ROLE_BOUGHT)) {
            await member.roles.add(ROLE_BOUGHT).catch(() => {});
        }

        return interaction.reply({
            content: `✅ Đơn hàng **${orderId}** đã được tạo & lưu thành công!`,
            flags: MessageFlags.Ephemeral
        });
    }
};
