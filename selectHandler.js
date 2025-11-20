const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require("discord.js");

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
    fire: "<a:__:1440412184139141344>",
    discord: "<:dis:1440934851287973939>",
    youtube: "<:_youtube:1440936429135073420>",
    capcut: "<:CapCut75:1440937299721588748>",
    canva: "<:canva:1440938072609919098>",
    chatgptplus: "<:chatgpt:1440939714663415959>",
    spotify: "<:Spotify:1440940912128823357>"
};

// ============== CONFIG ==============
const POLICY_BOT = "https://discord.com/channels/1403204361294712912/1440369251406970991"
const POLICY_MENTION = "<#1439836900809773159>";
const POLICY_MENTION_ID = "<#1440187253094744165>";
const POLICY_URL = "https://discord.com/channels/1403204361294712912/1439836900809773159";

// ================= BUTTON PREMIUM =================
const premiumButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setLabel("🛒 MUA NGAY")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.com/channels/1403204361294712912/1434607156954398921"),

    new ButtonBuilder()
        .setLabel("📜 CHÍNH SÁCH")
        .setStyle(ButtonStyle.Link)
        .setURL(POLICY_URL)
);

// ========== PREMIUM STYLE FUNCTION ==========
function createPremiumEmbed({ title, thumbnail, desc, fields, footer }) {
    return new EmbedBuilder()
        .setThumbnail(thumbnail)
        .setTitle(`✨・${title}`)
        .setDescription(
`> **『 VORTEX LEGION SERVICE 』**  
> *Dịch vụ cao cấp – bảo hành uy tín – hoàn tiền nếu lỗi.*  
───────────────  
${desc}`
        )
        .addFields(fields)
        .setFooter({ text: `LEGION STORE 🌐 | ${footer}` })
        .setImage("https://media.discordapp.net/attachments/1428250611262029945/1439883466173845664/Ephoto360.com_169061a88631ea.jpg?ex=691d74fa&is=691c237a&hm=fdcf8727ef044d940c43593f9464199f0215a18418ec86933448881c0a4d274f&=&format=webp&width=1250&height=750");
}

module.exports = async function (interaction) {
    try {
        if (!interaction.isStringSelectMenu() || interaction.customId !== "chon-san-pham") return;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const option = interaction.values[0];
        let embed;

        // =====================================================
        //                       SWITCH
        // =====================================================

        // ========================= NICHO LOGIN =========================
        if (option === "nicho-login") {
            embed = createPremiumEmbed({
                title: `Nicho Bust Login ${EMOJI.boost}`,
                thumbnail: "https://i.imgur.com/fQy4QG6.png",
                desc: "> **Giá rẻ – an toàn – tốc độ cực nhanh**",
                fields: [
                    {
                        name: `${EMOJI.ribbon} GÓI DỊCH VỤ`,
                        value:
`\`\`\`
• 2 Tháng: 100K
• 2 Tháng (Gia Hạn): 115K
• 4 Tháng (Gia Hạn): 210K
• 6 Tháng (Gia Hạn): 310K
• 12 Tháng (Gia Hạn): 630K
• 12 Tháng (Nâng 1 Lần): 800K – Tặng decor 66K
\`\`\``
                    },
                    {
                        name: `${EMOJI.warning}LƯU Ý`,
                        value: `
• Cần TK + MK + 2FA  
• Chính sách: ${POLICY_MENTION}  
• Gia hạn là gì? → ${POLICY_MENTION_ID}
                        `
                    }
                ],
                footer: "Nicho Login Premium"
            });
        }

        // ========================= NICHO FIRST =========================
        else if (option === "nicho-first") {
            embed = createPremiumEmbed({
                title: `${EMOJI.boost}Nicho Lần Đầu `,
                thumbnail: "https://i.imgur.com/WqosP5r.png",
                desc: "> **Dành cho tài khoản chưa từng sử dụng Nicho trước đó**",
                fields: [
                    {
                        name: `${EMOJI.ribbon} GÓI DỊCH VỤ`,
                        value:
`\`\`\`
• Nicho lần đầu 3 tháng: 95K
\`\`\``
                    },
                    {
                        name: `${EMOJI.warning}LƯU Ý`,
                        value: `
• Tài khoản phải tạo trên 30 ngày  
• Chưa từng mua Nicho  
• Chính sách: ${POLICY_MENTION}
                        `
                    }
                ],
                footer: "Nicho First Premium"
            });
        }

        // ========================= SERVER BOOST =========================
        else if (option === "server-bust") {
            embed = createPremiumEmbed({
                title: `Server Boost ${EMOJI.fire}`,
                thumbnail: "https://i.imgur.com/M8G5fbC.png",
                desc: "> **Đẩy cấp server – tăng uy tín – siêu rẻ**",
                fields: [
                    {
                        name: `${EMOJI.hype} GÓI 1 THÁNG`,
                        value:
`\`\`\`
• x14 (boost) → 175K 
• x20 (boost)→ 235K
• x26 (boost)→ 285K
• x28 (boost)→ 325K
• x2 (boost)→ 35K
\`\`\``
                    },
                    {
                        name: `${EMOJI.hype} GÓI 3 THÁNG`,
                        value:
`\`\`\`
• x14 (boost)→ 450K
• x20 (boost)→ 535K
• x26 (boost)→ 665K
• x28 (boost)→ 695K
• x2 (boost)→ 90K
\`\`\``
                    },
                    {
                        name: `${EMOJI.warning}LƯU Ý`,
                        value: `
• Cần link mời vĩnh viễn  
• Chính sách: ${POLICY_MENTION}
                        `
                    }
                ],
                footer: "Boost Premium"
            });
        }

        // ========================= SETUP SERVER =========================
        else if (option === "Setup D1scord Server") {
            embed = createPremiumEmbed({
                title: `Setup D1scord Server ${EMOJI.fire}`,
                thumbnail: "https://i.imgur.com/fQy4QG6.png",
                desc: "> **Setup đẹp – tối ưu – chuyên nghiệp**",
                fields: [
                    {
                        name: `${EMOJI.fire} BASIC (50K)`,
                        value:
`\`\`\`
• Kênh cơ bản theo yêu cầu
• Role cơ bản theo yêu cầu
• setup font chữ đẹp
\`\`\``
                    },
                    {
                        name: `${EMOJI.fire} PLUS (200K)`,
                        value:
`\`\`\`
• Kênh + role cơ bản ( tuỳ yêu cầu )  
• Welcome / Goodbye  
• Anti spam / RR  / 
• 30 emoji
• Add bot cơ bản ( free )
\`\`\``
                    },
                    {
                        name: `${EMOJI.fire} PREMIUM (300K)`,
                        value:
`\`\`\`
• Basic + Plus  
• Bot riêng tên server  
• Anti-link / anti-spam  
• Ticket + Ban  
\`\`\``
                    },
                    {
                        name: `${EMOJI.black} Dich vụ liên quan`,
                        value: "Ticket / Anti Link / Verify / Level / Ban (15K – 20K)"
                    },
                    {
                        name: `${EMOJI.warning} Lưu ý!`,
                        value: `
Chính sách: ${POLICY_MENTION} 
Hiểu rõ hơn các tính nắng : ${POLICY_BOT} 

                    `}
                ],
                footer: "Setup Premium"
            });
        }

        // ========================= TRUNG GIAN =========================
        else if (option === "giao-dich-trung-gian") {
            embed = createPremiumEmbed({
                title: `${EMOJI.fire}Giao Dịch Trung Gian `,
                thumbnail: "https://i.imgur.com/DJ4DxNy.png",
                desc: "> **An toàn – bảo mật – có quay video**",
                fields: [
                    {
                        name: `${EMOJI.black} BẢNG GIÁ`,
                        value:
`\`\`\`
• < 1.000.000đ → 15K  
• 1M – 2M → 20K  
• 2M – 3M → 30K  
• 3M – 4M → 40K  
• 4M+ → 50K  
\`\`\``
                    },
                    {
                        name: `${EMOJI.warning}LƯU Ý`,
                        value: `
• Có quay video làm bằng chứng  
• Chính sách: ${POLICY_MENTION}
                        `
                    }
                ],
                footer: "Middleman Premium"
            });
        }
         // ========================= Acc discord =========================
         else if (option === "Acc D1sc0rd"){
             embed = createPremiumEmbed ({
                 title: `${EMOJI.discord} Acc D1sc0rd`,
                 thumbnail: "https://i.imgur.com/DJ4DxNy.png",
                 desc: "> **Tài Khoản D1sc0rd Cổ đầy đủ thông tin**",
                 fields:[
                    {
                         name: `${EMOJI.discord} Acc D1sc0rd Cổ 2021`,
                         value: 
`\`\`\`                         
GIÁ : 55.000 VND 
\`\`\``
                    },
                    {
                         name: `${EMOJI.discord} Acc D1sc0rd Cổ 2020`,
                         value: 
`\`\`\`                         
GIÁ : 60.000 VND 
\`\`\``
                    },
                    {
                         name: `${EMOJI.discord} Acc D1sc0rd Cổ 2019`,
                         value: 
`\`\`\`                         
GIÁ : 70.000 VND 
\`\`\``
                    },
                    {
                         name: `${EMOJI.discord} Acc D1sc0rd Cổ 2018`,
                         value: 
`\`\`\`                         
GIÁ : 80.000 VND 
\`\`\``
                    },
                    {
                         name: `${EMOJI.discord} Acc D1sc0rd Cổ 2017`,
                         value: 
`\`\`\`                         
GIÁ : 90.000 VND 
\`\`\``
                    },
                    {
                         name: `${EMOJI.discord} Acc D1sc0rd Cổ 2016`,
                         value: 
`\`\`\`                         
GIÁ : 140.000 VND 
\`\`\``
                    },
                    {
                        name: `${EMOJI.warning}LƯU Ý`,
                        value: `
• Chính sách: ${POLICY_MENTION}  
                        `
                    }
                 ],
                 footer: "Acc d1scord cổ"

            });
        }
        // ========================= Youtub3 Pr3mium =========================
else if (option  === "Youtub3 Pr3mium") {
      embed = createPremiumEmbed ({ 
	title: ` ${EMOJI.youtube}Y0utub3 Pr3mium` ,
    thumbnail: "https://i.imgur.com/DJ4DxNy.png",
	desc: "> **Xem Ytb Không Quảng Cáo**",
	fields: [ 
	    {
                name: `${EMOJI.youtube} Y0utub3 Pr3mium Cá Nhân 1th`,
                value: `
\`\`\`
GIÁ : 60.000 VND
\`\`\`
${EMOJI.arrow} **Bao Nhiêu Tháng x50 Lên**
**-----------------------------**

                `
            },
            {
                name: `${EMOJI.youtube} Y0utub3 Pr3mium Family 1th`,
                value: `
\`\`\`
GIÁ : 50.000 VND
\`\`\`
                `
            },
            {
                name: `${EMOJI.youtube} Y0utub3 Pr3mium Family 3th`,
                value: `
\`\`\`
GIÁ : 120.000 VND
\`\`\`
                `
            },
            {
                        name: `${EMOJI.warning}LƯU Ý`,
                        value: `
• Chính sách: ${POLICY_MENTION}  
                        `
            }
        ],
        footer: "Y0utub3 Pr3mium"
    });
}  

// ========================= capcut  =========================
else if (option  === "Capcut Pr0") {
      embed = createPremiumEmbed ({ 
	title: ` ${EMOJI.capcut}Capcut Pr0` ,
	desc: "> **Thiết Kế Edit Video Không Giới Hạn**",
	fields: [ 
	    {
		name: `${EMOJI.capcut} Capcut Pr0 Acc Cấp 1th  `,
		value: 
`\`\`\`      
GIÁ : 60.000 VND
\`\`\`` 
	    },
        {
		name: `${EMOJI.capcut} Capcut Pr0 Acc Cấp 12th  `,
		value: 
`\`\`\`      
GIÁ : 400.000 VND
\`\`\`` 
	    },
        {
		name: `${EMOJI.capcut} Capcut Pr0 Chính Chủ 12th `,
		value: 
`\`\`\`      
GIÁ : 800.000 VND
\`\`\`` 
	    },   
            {
                        name: `${EMOJI.warning}LƯU Ý`,
                        value: `
• Chính sách: ${POLICY_MENTION}  
                        `
            }       

                ],
                footer: "Capcut Pr0"
            });
        } 

// ========================= Canva Pro =========================
else if (option  === "Canva Pr0") {
      embed = createPremiumEmbed ({ 
	title: ` ${EMOJI.canva }Canva Pr0` ,
	desc: "> **Thiết Kế Không Giới Hạn**",
	fields: [ 
	    {
		name: `${EMOJI.canva}Canva Pr0 12th ( Chính Chủ )`,
		value: 
`\`\`\`      
GIÁ : 140.000 VND
\`\`\`` 
	    },
                    {
                        name: `${EMOJI.warning}LƯU Ý`,
                        value: `
• Chính sách: ${POLICY_MENTION}  
                        `
            }
                ],
                footer: "Canva Pr0"
            });
        } 
// ========================= Chat GPT Plus =========================
else if (option  === "Chat GPT Plus") {
      embed = createPremiumEmbed ({ 
	title: ` ${EMOJI.chatgptplus}Chat GPT Plus` ,
	desc: "> **Chat AI Trí Tuệ Nhân Tạo**",
	fields: [ 
	    {
		name: `${EMOJI.chatgptplus}Chat GPT Plus 1th ( Chính Chủ - Team ) `,
		value: 
`\`\`\`      
GIÁ : 150.000 VND
\`\`\`` 
	    },
        {
		name: `${EMOJI.chatgptplus}Chat GPT Plus Acc Cấp 1th ( Riêng Tư )`,
		value: 
`\`\`\`      
GIÁ : 120.000 VND
\`\`\`` 
	    },
        {
                        name: `${EMOJI.warning}LƯU Ý`,
                        value: `
• Chính sách: ${POLICY_MENTION}  
                        `
            } 
                ],
                footer: "Chat GPT Plus "
            });
        }
        // ========================= Spot1fy Pr3mium =========================
else if (option  === "Spot1fy Pr3mium") {
      embed = createPremiumEmbed ({ 
	title: ` ${EMOJI.spotify}Spot1fy Pr3mium` ,
	desc: "> **Nghe Nhạc Không Quảng Cáo**",
	fields: [ 
	    {
		name: `${EMOJI.spotify}Sp0t1fy Pr3mium Family 1th`,
		value: 
`\`\`\`      
GIÁ : 50.000 VND
\`\`\`` 
	    },
        	    {
		name: `${EMOJI.spotify}Sp0t1fy Pr3mium Family 6th`,
		value: 
`\`\`\`      
GIÁ : 210.000 VND
\`\`\`` 
	    },
                	    {
		name: `${EMOJI.spotify}Sp0t1fy Pr3mium Family 12th`,
		value: 
`\`\`\`      
GIÁ : 300.000 VND 
\`\`\`` 
	    },
                        	    {
		name: `${EMOJI.spotify}Sp0t1fy Pr3mium Cá Nhân 4th`,
		value: 
`\`\`\`      
GIÁ : 110.000 VND 
\`\`\`` 
	    },
                                	    {
		name: `${EMOJI.spotify}Sp0t1fy Pr3mium Cá Nhân 12th`,
		value: 
`\`\`\`      
GIÁ : 430.000 VND 
\`\`\`` 
	    },
                ],
                footer: "Spot1fy Pr3mium"
            });
        }

       else {
            return interaction.editReply({ content: "❓ Đang cập nhật dịch vụ!" });
        }

        return interaction.editReply({ embeds: [embed], components: [premiumButtons] });

    } catch (err) {
        console.error("selectHandler error:", err);
        if (!interaction.replied) {
            return interaction.followUp({
                content: "⚠️ Có lỗi xảy ra!",
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
