const {
    SlashCommandBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    MessageFlags
} = require("discord.js");
const { annotate } = require("pdfkit");

const EMOJI = {
    boost: "<a:Booster:1433372704022462596>",
    diamond: "<a:asdasd:1433371183209775154>",
    ribbon: "<a:BoosterN:1433372723731763230>",
    shield: "<a:verifygif:1433371488672813107>",
    warning: "<a:nlem:1433371542506705007>",
    arrow: "<a:arrow1:1433374242920992889>",
    star: "<a:IMG_3041:1433371324838838282>",
    power: "<a:_boost_:1433372862353248366>",
    money: "<a:Verify_edited2:1433371443768594493>",
    black: "<a:black:1440412071115362444>",
    hype: "<a:hype:1440412458865918022>",
    fire: "<a:__:1440412184139141344>"
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("menu")
        .setDescription("Hiển thị bảng giá dạng trang trí đẹp"),

    async execute(interaction) {
       
        const embed = new EmbedBuilder()
            
            .setTitle(`${EMOJI.fire} BẢNG GIÁ DỊCH VỤ VORTEX LEGION`)
            .setDescription(
                "» Giá có thể thay đổi theo thời gian và thị trường\n" +
                "» Chọn sản phẩm bạn muốn xem giá ở thanh bên dưới\n\n" +
                "✔️ **Check Legit Shop & Feedback:**\n" +
                "👉 <#1435660590671597578>"
            )
            .setThumbnail("https://cdn.discordapp.com/attachments/1434057266998280222/1436757283009724577/Ephoto360.com_1690a22128d5e0.jpg")
            .setImage("https://cdn.discordapp.com/attachments/1428250611262029945/1439883466173845664/Ephoto360.com_169061a88631ea.jpg")
            .setFooter({
                text: "Vortex Legion",
                iconURL: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png"
            });

        const menu = new StringSelectMenuBuilder()
            .setCustomId("chon-san-pham")
            .setPlaceholder("📌 Chọn dịch vụ bạn quan tâm")
            .addOptions(
                {
                    label: "Nicho Bust Login",
                    value: "nicho-login",
                    description: "Dịch vụ đăng nhập Nicho uy tín",
                    emoji: { id: "1433372704022462596", animated: true }
                },
                {
                    label: "Nicho Bust Lần Đầu",
                    value: "nicho-first",
                    description: "Tài khoản chưa sử dụng Nicho",
                    emoji: { id: "1433372723731763230", animated: true }
                },
                {
                    label: "Server Bust",
                    value: "server-bust",
                    description: "Nâng cấp sức mạnh server của bạn",
                    emoji: { id: "1433372862353248366", animated: true }
                },
                {
                    label: "Setup D1scord Server",
                    value: "Setup D1scord Server",
                    description: "Setup server Discord chuyên nghiệp",
                    emoji: { id: "1440412458865918022", animated: true }
                },
                {
                    label: "Giao dịch trung gian",
                    value: "giao-dich-trung-gian",
                    description: "Bảo đảm an toàn giao dịch",
                    emoji: { id: "1433371488672813107", animated: true }
                },
                {
                    label: "Acc D1sc0rd",
                    value: "Acc D1sc0rd",
                    description: "Acc D1scord cổ đầy đủ thông tin" ,
                    emoij: { id: "1440934851287973939" }
                },
                {
                    label: "Youtub3 Pr3mium",
                    value: "Youtub3 Pr3mium",
                    description: "Xem ytb không quảng cáo và nhiều tính năng",
                    emoij: {id: "1440936429135073420"}
                },
                {
                    label: "Capcut Pr0",
                    value: "Capcut Pr0",
                    description: "Thiết kế video thoả sức sáng tạo",
                    emoij: {id: "1440937299721588748"}
                },
                {
                    label: "Canva Pr0",
                    value: "Canva Pr0",
                    description: "Thiết kế 0 giới hạn",
                    emoij: {id: "1440938072609919098"}
                },
                {
                    label: "Chat GPT Plus",
                    value: "Chat GPT Plus",
                    description: "Trí tuệ nhân tạo AI",
                    emoij: { id: "1440939714663415959"}
                },
                {
                    label: "Spot1fy Pr3mium",
                    value: " Spot1fy Pr3mium",
                    description: "Nghe nhạc không lo quảng cáo",
                    emoij: {id: "1440940912128823357"}
                }
  
            );

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};
