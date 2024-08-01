
const { MessageActionRow } = require('discord.js')
const { Client, GatewayIntentBits,
REST,
Routes,
ApplicationCommandOptionType, 
EmbedBuilder,
ChannelType,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle, PermissionFlagsBits, AttachmentBuilder, StringSelectMenuBuilder, ActivityType,
Partials,
MessageButton,
ModalBuilder,
TextInputBuilder,
TextInputStyle, MessageEmbed } = require('discord.js')
const chalk = require('chalk')
const ms = require('ms')
let CronJob = require('cron').CronJob;
const Discord = require('discord.js')
const { QuickDB, JSONDriver } = require("quick.db");
const jsonDriver = new JSONDriver();
const db = QuickDB.createSingleton({ driver: jsonDriver });
const client = new Client({
  intents: [
    Object.keys(GatewayIntentBits)
  ],
  partials: [
    Object.keys(Partials)
  ]
});
///ايدي الي هيتحول له
const transfer = "1256376371438026903";
client.on('ready', async () => {
  console.log(chalk.bold.underline.blue(`✅ Logged in as ${client.user.tag}`))
  const rest = new REST({ version: 10 }).setToken("MTI2NTY1NTU2NTgyOTU0MTk1OA.GvpI-X.jV39z9HyCQlhorsSZfBBPphSxJCSBn_xPKMZ5M");//توكن
  const commands = [
    {
      name: `ticket-shop`,
      description: `ارسال رسالة شراء المتجر.`,
      dm_permissions: false,
      default_member_permissions: 8,
    },
    {
      name: 'shop',
      description: 'لإنشاء متجر في كاتيجوري محدد.',
      dm_permission: false,
      default_member_permissions: 8,
      options: [
        {
          name: `category`,
          description: `الكاتيقوري الذي سيتم انشاء المتجر به.`,
          required: true,
          type: ApplicationCommandOptionType.Channel,
          channel_types: [ChannelType.GuildCategory]
        },
        {
          name: `name`,
          description: `اسم المتجر.`,
          type: ApplicationCommandOptionType.String,
          max_length: 24,
          required: true,
        },
        {
          name: `seller`,
          description: `الشخص الذي يمكنه البيع في هذا المتجر.`,
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: `shop_mentions`,
          description: `رتبة منشن المتجر.`,
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
        {
          name: `everyone_mentions`,
          description: `عدد منشنات ايفري ون المسموح بها في هذا المتجر.`,
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: `here_mentions`,
          description: `عدد منشنات هير المسموح بها في هذا المتجر.`,
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: `shop_role_mentions`,
          description: `عدد منشنات رتبة المتجر المسموح بها.`,
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ]
    },
    {
      name: 'give-role',
      description: 'اعطاء رتبة لشخص لمدة محددة',
      dm_permission: false,
      default_member_permissions: 8,
      options: [
        {
          name: `user`,
          description: `العضو الذي تريد تسليمه الرتبة.`,
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: `role`,
          description: `الرتبة التي سيتم تسليمها للعضو.`,
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
        {
          name: `duration`,
          description: `المدة التي سيتم ازالة الرتبة بعد انتهائها.`,
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: `10s`, value: `10s` },
            { name: `1m`, value: `1m` },
            { name: `5m`, value: `5m` },
            { name: `10m`, value: `10m` },
            { name: `30m`, value: `30m` },
            { name: `1h`, value: `1h` },
            { name: `3h`, value: `3h` },
            { name: `6h`, value: `6h` },
            { name: `12h`, value: `12h` },
            { name: `1d`, value: `1d` },
            { name: `3d`, value: `3d` },
            { name: `1w`, value: `1w` },
            { name: `2w`, value: `2w` },
            { name: `4w`, value: `4w` },
          ]
        },
      ]
    },
    {
      name: 'set-mention',
      description: 'تحديد عدد منشنات متجر محدد',
      dm_permission: false,
      default_member_permissions: 8,
      options: [
        {
          name: `shop`,
          description: `حدد المتجر الذي تريد التعديل عليه.`,
          type: ApplicationCommandOptionType.Channel,
          required: true,
          channel_types: [ChannelType.GuildText]
        },
        {
          name: `mention`,
          description: `نوع المنشن.`,
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: `@everyone`, value: `everyone` },
            { name: `@here`, value: `here` },
            { name: `@shop_role`, value: `shop_role` },
          ]
        },
        {
          name: `count`,
          description: `عدد المنشنات الذي سيتم تحديده.`,
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ]
    },
    {
      name: `shop-mentions`,
      description: 'اظهار عدد منشنات المتجر',
      dm_permission: false,
      default_member_permissions: 1,
    },
    {
      name: 'category-mentions',
      description: 'تحديد منشنات كاتيجوري محدد',
      dm_permission: false,
      default_member_permissions: 8,
      options: [
        {
          name: `category`,
          description: `الكاتيجوري الذي تريد تحديد منشناته`,
          type: ApplicationCommandOptionType.Channel,
          channel_types: [ChannelType.GuildCategory],
          required: true
        },
        {
          name: `everyone_mention_count`,
          description: `عدد منشنات ايفري ون المسموح بها.`,
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: `here_mention_count`,
          description: `عدد منشنات هير المسموح بها.`,
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ]
    },
  ];

  (async () => {
    try {
      console.log(`Registring slash commands...`)

      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
      )

      console.log(`Slash commands were registered successfully!`)
    } catch (error) {
      console.log(`There was an error : ${error}`)
    }
  })();
})
client.on('interactionCreate', async i => {
  if (i.isChatInputCommand()) {
    switch (i.commandName) {
      case 'shop': {
        const categoryId = i.options.get('category').value;
        const name = i.options.get('name').value;
        const sellerId = i.options.get('seller').value;
        const mentionedRoleId = i.options.get('shop_mentions').value;
        const everyoneMen = i.options.get('everyone_mentions').value;
        const hereMen = i.options.get('here_mentions').value;
        const shopRoleMen = i.options.get('shop_role_mentions').value;

        const channel = await i.guild.channels.create({
          name: `${name}`,
          type: ChannelType.GuildText,
          parent: categoryId,
          permissionOverwrites: [
            {
              id: i.guild.id,
              deny: [
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.AddReactions,
                PermissionFlagsBits.CreatePublicThreads,
                PermissionFlagsBits.CreatePrivateThreads,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.EmbedLinks,
              ],
            },
            {
              id: sellerId,
              allow: [
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.AddReactions,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.MentionEveryone,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.UseExternalEmojis,
                PermissionFlagsBits.ReadMessageHistory,
              ],
            },
          ],
        });
        const ob = {
          channelId: channel.id,
          categoryId: categoryId,
          sellerId: sellerId,
          everyoneMentions: everyoneMen,
          hereMentions: hereMen,
          mentionedRole: mentionedRoleId,
          shopRoleMentions: shopRoleMen,
        }
        await db.set(`shop_${channel.id}`, ob)
        const embed = new EmbedBuilder()
          .setColor('Green')
          .setTitle(`تم انشاء المتجر`)
          .setFields(
            { name: `شات المتجر`, value: `<#${channel?.id}>`, inline: true },
            { name: `رتبة المتجر`, value: `<@${sellerId}>`, inline: true },
            { name: `موعد انشاء المتجر`, value: `<t:${parseInt(Date.now() / 1000)}:R>`, inline: true },
            { name: `عدد منشنات ايفري ون`, value: `${everyoneMen}`, inline: true },
            { name: `عدد منشنات هير`, value: `${hereMen}`, inline: true },
            { name: `عدد منشنات رتبة المتجر`, value: `${shopRoleMen}`, inline: true },
            { name: `رتبة منشن المتجر`, value: `<@&${mentionedRoleId}>`, inline: true },
            { name: `المسؤول`, value: `<@${i.user.id}>`, inline: true },
          )
          .setFooter({ text: `${i.guild.name}`, iconURL: i.guild.iconURL() })
          .setTimestamp()
        await i.reply({ embeds: [embed] })
      } break;
      case 'give-role': {
        const userId = i.options.get('user').value;
        const roleId = i.options.get('role').value;
        const duration = i.options.get('duration').value;

        const msDuration = ms(duration)

        const user = await i.guild.members.fetch(userId).catch(async () => {
          return await i.reply({ content: `❌ **لا يمكنني العثور على هذا العضو.**`, ephemeral: true })
        })
        const role = await i.guild.roles.fetch(roleId).catch(async () => { return })
        await user.roles.add(roleId)
        const ob = {
          guildId: i.guild.id,
          userId: userId,
          roleId: roleId,
          duration: Date.now() + msDuration,
        }
        await db.set(`tempRole_${userId}_${roleId}`, ob)
        await i.reply({ content: `✅ **تم تسليم رتبة \`${role.name}\` الى العضو ${user.user.tag} لمدة \`${duration}\`.**` })
      } break;
      case 'set-mention': {
        const channelId = i.options.get('shop').value;
        const mentionStyle = i.options.get('mention').value;
        const count = i.options.get('count').value;
        const data = await db.get(`shop_${channelId}`)
        if (!data) return await i.reply({ content: `❌ **لا يمكنني العثور على هذا المتجر !**`, ephemeral: true })
        if (mentionStyle === 'everyone') {
          await db.set(`shop_${channelId}.everyoneMentions`, count)
        } else if (mentionStyle === 'here') {
          await db.set(`shop_${channelId}.hereMentions`, count)
        } else if (mentionStyle === '1183087321818607768') {
          await db.set(`shop_${channelId}.shopRoleMentions`, count)
        }
        await i.reply({ content: `✅ **تم التعديل على عدد منشنات المتجر <#${channelId}> بنجاح.**` })
      } break;
        case 'shop-mentions': {
          const data = await db.get(`shop_${i.channel.id}`);
          if (!data) return await i.reply({ content: "هذا الشات ليس متجراً!", ephemeral: true });




          await i.reply({
            content: `**- 🛒 Everyone : ${data.everyoneMentions}\n- 🛒 Here : ${data.hereMentions}\n- 🛒 Shop mention : ${data.shopRoleMentions}**`,
          });
         i.channel.send({
          content: `https://cdn.discordapp.com/attachments/1254569003607789609/1265369859231842314/standard_5.gif?ex=66a29483&is=66a14303&hm=789ad16c82951b3de1f91bb7f78f9df6540900f3d1843833240aebcb033f3506&`//
        });
        }
        break;
      case 'category-mentions': {
        const categoryId = i.options.get('category').value;
        const evcount = i.options.get('everyone_mention_count').value;
        const hecount = i.options.get('here_mention_count').value;

        const category = await i.guild.channels.fetch(categoryId).catch(async () => {
          return i.reply({ content: `❌ **لا يمكنني الوصول على هذا الكاتيجوري !**`, ephemeral: true })
        })
        for (const channel of category.children.cache) {
          const ob = {
            channelId: channel[0],
            categoryId: categoryId,
            everyoneMentions: evcount,
            hereMentions: hecount,
          }
          await db.set(`shop_${channel[0]}`, ob)
        }
          const ob = {
            categoryId: categoryId,
            everyoneMentions: evcount,
            hereMentions: hecount,
          }
        await db.set(`categoryMentions_${categoryId}`, ob)
        await i.reply({ content: `✅ **تم تحديد المنشنات في الكاتيجوري \`${category.name}\`**` })
      } break;
      case 'ticket-shop': {
        const embed = new EmbedBuilder()
          .setTitle('شراء متجر')
          .setDescription('**__قم بالضغط على الزر في الاسفل لشراء مت__**')
          .setImage('https://cdn.discordapp.com/attachments/1254569003607789609/1264648863202021396/5b7fc1c6f50ed1c1.png-1.webp?ex=66a1ef49&is=66a09dc9&hm=5dadbe332ef94d4f8e4b089eeb59cabd6eb4966d672cb02a9735a4a7cdb15493&')
          .setColor('#000100');

        const row = new ActionRowBuilder()
          .addComponents(new ButtonBuilder()
            .setCustomId('buy_shop_ticket')
            .setLabel('شراء متجر')
            .setStyle(ButtonStyle.Primary)
          );

        await client.channels.cache.get(i.channel.id).send({ embeds: [embed], components: [row] });
        await i.reply({ content: '✅', ephemeral: true });
      }
    }
  } else if (i.isButton()) {
    switch (i.customId) {
      case 'cancel': {
const data = await db.get(`shop_${i.channel.id}`)

  if (i.user.id === data.sellerId) {
   i.message.delete();
  await i.channel.send({ content: '**تم الغاء العملية**' })

 }
      } break;
      case 'buy_shop_ticket': {
        const data = await db.get(`buy_shop_ticket_${i.member.id}`);
        if (data) return await i.reply({ content: `**من فضلك عندك تذكره لا يمكنك فتح تذكره اخره - <#${data.channelId}>**`, ephemeral: true });
        await i.deferReply({ ephemeral: true }).catch(() => {});

await i.editReply({content : `Please wait ....`})
        const channel = await i.guild.channels.create({
          name: `buy shop ${i.user.tag}`,
          type: ChannelType.GuildText,
          parent: '1258032332045160530',// كتغوري التكتات
          permissionOverwrites: [
            {
              id: i.user.id,
              allow: [
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ViewChannel,
              ]
            },
            {
              id: i.guild.id,
              deny: [
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ViewChannel
              ]
            },
          ]
        });
        await db.set(`buy_shop_ticket_${i.member.id}`, { userId: i.member.id, channelId: channel.id })

const embedAboveButtons = new EmbedBuilder()
  .setColor('#000100')
  .setDescription(`- اهلا بتكت شراء متجر 
- يرجى اختيار المتجر المناسب لك
- قراءة قوانين المتاجر
دمتم سالمين`)
  .setFooter({ text: `${i.guild.name}`, iconURL: i.guild.iconURL() })
  .setTimestamp()
.setAuthor({ name: `${i.guild.name}`, iconURL: i.guild.iconURL() })

  .setImage('https://cdn.discordapp.com/attachments/1254569003607789609/1264648863202021396/5b7fc1c6f50ed1c1.png-1.webp?ex=66a1ef49&is=66a09dc9&hm=5dadbe332ef94d4f8e4b089eeb59cabd6eb4966d672cb02a9735a4a7cdb15493&');

        const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('₊˚໒  ˚𝐔𝐋𝐓𝐑𝐀 🔥🛒  ୭-shop')// ايدي الزر (اذا ما تعرف له لا تسوي شي )
            .setLabel('𝐔𝐋𝐓𝐑𝐀 🛒')//الكلام الي على الزر
            .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('₊˚໒  ˚𝐒𝐔𝐏𝐄𝐑 🛒  ୭-shop')// ايدي الزر (اذا ما تعرف له لا تسوي شي )
            .setLabel('𝐒𝐔𝐏𝐄𝐑 🛒')//الكلام الي على الزر
            .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('₊˚໒﹕ 𝐈𝐃𝐄𝐀𝐋 🛒˚  ୭-shop')// ايدي الزر (اذا ما تعرف له لا تسوي شي )
            .setLabel('𝐈𝐃𝐄𝐀𝐋 🛒')//الكلام الي على الزر
            .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('₊˚໒  ˚𝐌𝐄𝐆𝐀 🛒  ୭-shop')// ايدي الزر (اذا ما تعرف له لا تسوي شي )
            .setLabel('𝐌𝐄𝐆𝐀 🛒')//الكلام الي على الزر
            .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('₊˚໒  ˚𝑩𝑨𝑺𝑰𝑪 🛒  ୭-shop')// ايدي الزر (اذا ما تعرف له لا تسوي شي )
            .setLabel('𝑩𝑨𝑺𝑰𝑪 🛒')//الكلام الي على الزر
            .setStyle(ButtonStyle.Primary)
        );
        await channel.send({ embeds: [embedAboveButtons], components: [row] });
        await channel.send({
            content: `https://cdn.discordapp.com/attachments/1254569003607789609/1265369859231842314/standard_5.gif?ex=66a33d43&is=66a1ebc3&hm=da935823fd1149f36a3a83527955905dcad00643b6bcfc79ab678352d6e8543b&`
        });

        await i.editReply({ content: `**-  ..تـم انـشـاء تـذكرتـك بنـجـاح.. 
                - روم التـذكـرة : <#${channel.id}>**`, ephemeral: true })
      } break;
        case '₊˚໒  ˚𝐔𝐋𝐓𝐑𝐀 🔥🛒  ୭': {
              const ShopData = {
                price: 300000,//سعر المتجر
                categoryID: "1267076463170162709",//كتاغوري المتجر
              }
        createShopFromTicket(i,ShopData)
            } break;
            case '₊˚໒  ˚𝐒𝐔𝐏𝐄𝐑 🛒  ୭': {
              const ShopData = {
                price: 250000,//سعر المتجر
                categoryID: "1266112025273307218",//كتاغوري المتجر
              }
        createShopFromTicket(i,ShopData)
            } break;
            case '₊˚໒  ˚𝐈𝐃𝐄𝐀𝐋 🛒  ୭': {
              const ShopData = {
                      price: 200000,//سعر المتجر
                      categoryID: "1266112026451906692",//كتاغوري المتجر
                    }
        createShopFromTicket(i,ShopData)
            } break;
            case '₊˚໒  ˚𝐌𝐄𝐆𝐀 🛒  ୭': {
              const ShopData = {
                      price: 130000,//سعر المتجر
                      categoryID: "1266112027634569299",//كتاغوري المتجر
                    }
        createShopFromTicket(i,ShopData)
            } break;
            case '₊˚໒  ˚𝑩𝑨𝑺𝑰𝑪 🛒  ୭':{
              const ShopData = {
                      price: 1,//سعر المتجر
                      categoryID: "1266112029152903270",//كتاغوري المتجر
                    }
  createShopFromTicket(i,ShopData)
      } break;
    }
  }
})
const proTax = require('probot-taxs')
async function createShopFromTicket(i,Data) {
        const data = await db.get(`shop_credit_${i.member.id}`)
        if (data) return await i.reply({ content: `**لا يمكنك شراء متجرين في نفس الوقت.**`, ephemeral: true })
        const price = Data.price
        const defaultMentions = 10//عدد منشن متجر
        const defaultRoleID = "1258032251417923645"//رتبة منشن متجر
        const categoryID = Data.categoryID
        const taxs = proTax.tax(price,false)

        const choosedShop = i.message.components[0].components.find(c => c.data.custom_id == i.customId).data.label;
  const embed = new EmbedBuilder()
  .setAuthor({ name: i.guild.name, iconURL: i.guild.iconURL() })
  .setTitle(`Choosed Shop: ${choosedShop}\nprice: ${price}`)
  .setDescription(`- <@${i.member.id}>\n\`\`\`ملاحظة: انسخ الرسالة ادناء للتحويل بسرعة لديك 60 ثانية\`\`\``)
  .setTimestamp();


        await i.deferUpdate();
        await client.channels.cache.get(i.channel.id)?.send({
          embeds: [embed],
          })
await client.channels.cache.get(i.channel.id)?.send({
content: `#credit ${transfer} ${taxs.tax}` })
        await db.set(`shop_credit_${i.member.id}`, i.member.id)

        const collectorFilter = m => m.author.bot === true;

        const collector = i.channel.createMessageCollector({ filter: collectorFilter, time: 60000 });
        collector.on('collect', async c => {
          if(c.content == `**:moneybag: | ${i.user.username}, has transferred \`$${price}\` to <@!${transfer}> **`){
            collector.stop('DONE')
          }
        })

        collector.on('end', async (collected, reason) => {
          console.log(reason)
          if(reason === 'DONE'){
            const msg = await i.channel.send({ content : `\`-\` **<@${i.member.id}>\nرجاء قم بكتابة اسم المتجر.**
\`-\` **__لا يمكنك تغيير الاسم بعد كتابته.__**` })

            const collectorFilter = m => m.author.id === i.user.id;

            await i.channel.awaitMessages({ filter : collectorFilter, max : 1, time : 300000, errors : ['time'] })

.then(async (m) => {
                            await m.first().channel.send({ content : `> ** تم انشاء متجرك بنجاح**
> **الرجاء قرائة جميع قوانين خاصة بالمتاجر **` })
              await db.delete(`buy_shop_ticket_${i.member.id}`)

              await db.delete(`shop_credit_${i.member.id}`)
              setTimeout(() => {
i.channel.delete()
              }, 5000)
              const channel = await m.first().guild.channels.create({
                name : `よ「🛒」﹕・${m.first().content}`,
                type : ChannelType.GuildText,
                parent : categoryID,
                permissionOverwrites: [
                  {
                    id: i.guild.id,
                    deny: [
                      PermissionFlagsBits.SendMessages,
                      PermissionFlagsBits.AddReactions,
                      PermissionFlagsBits.CreatePublicThreads,
                      PermissionFlagsBits.CreatePrivateThreads,
                      PermissionFlagsBits.AttachFiles,
                      PermissionFlagsBits.EmbedLinks,
                    ],
                  },
                  {
                    id: i.user.id,
                    allow: [
                      PermissionFlagsBits.SendMessages,
                      PermissionFlagsBits.AddReactions,
                      PermissionFlagsBits.AttachFiles,
                      PermissionFlagsBits.MentionEveryone,
                      PermissionFlagsBits.EmbedLinks,
                      PermissionFlagsBits.UseExternalEmojis,
                      PermissionFlagsBits.ReadMessageHistory,
                    ],
                  },
                ],
              })
              const data = await db.get(`categoryMentions_${channel.parentId}`)
              if(data){
                const ob = {
                channelId: channel.id,
                categoryId: data.categoryId,
                everyoneMentions: data.everyoneMentions,
                hereMentions: data.hereMentions,
                sellerId: i.user.id,
                mentionedRole: defaultRoleID,
                shopRoleMentions: defaultMentions,
                }
                await db.set(`shop_${channel.id}`, ob)
              }

              const embed = new EmbedBuilder()

              .setTitle('تم انشاء المتجر')
.setFields({ name : `باسم :`, value : `${channel.name} >`, inline : true },
{ name : `نوعه :`, value : `${choosedShop} `, inline : true },
{ name : `بواسطة :`, value : `${i.user.username} `, inline : true },
                { name : `صاحب المتجر :`, value : `<@${i.user.id}>`, inline : true },
              )
                .setColor('#ff0000')
              .setImage('attachment://hi.gif')
              .setFooter({ text : 'Dev by : evay' })
  await channel.send({ embeds : [embed], files : ['./hi.gif'] })
            }).catch(async (err) => {
              console.log(err)
              msg.edit({ content : `**لم يتم كتابة اسم في الوقت المحدد.**` })
              await db.delete(`shop_credit_${i.member.id}`)
            await db.delete(`buy_shop_ticket_${i.member.id}`)
              setTimeout(() => {
i.channel.delete()
              }, 5000)
            })
          } else {
            await db.delete(`shop_credit_${i.member.id}`)
            await db.delete(`buy_shop_ticket_${i.member.id}`)
            setTimeout(() => {
i.channel.delete()
              }, 5000)
          }
        })

} 
client.on('messageCreate', async message => {
  if (!message.guild) return;
  const data = await db.get(`shop_${message.channel.id}`)
  if (data && data.sellerId) { 
    if (data.everyoneMentions < 0 || data.hereMentions < 0 || data.shopRoleMentions < 0) {
      await message.channel.permissionOverwrites.create(message.guild.id, { ViewChannel: false })
      await message.channel.permissionOverwrites.create(data.sellerId, { ViewChannel: false })



    } else {
      if (message.content.includes('@everyone')) {
        await db.sub(`shop_${message.channel.id}.everyoneMentions`, 1)
      }
      if (message.content.includes('@here')) {
        await db.sub(`shop_${message.channel.id}.hereMentions`, 1)
      }
      if (message.content.includes(`<@&${data.mentionedRole}>`)) {
        await db.sub(`shop_${message.channel.id}.shopRoleMentions`, 1)
      }
    }
  }
  if (message.channel.name.startsWith('buy-shop-')) {
    if (message.content === '+close') {
      message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('```جاري اغلاق التذكرة...```')] })
      await db.delete(`shop_credit_${message.author.id}`)
      await db.delete(`buy_shop_ticket_${message.author.id}`)
      setTimeout(() => {
        message.channel.delete()
      }, 3000)
    }
  }
})
client.login("MTI2NTY1NTU2NTgyOTU0MTk1OA.GvpI-X.jV39z9HyCQlhorsSZfBBPphSxJCSBn_xPKMZ5M").catch(() => {//توكن
  console.log(chalk.red('The Token is not valid'))
})
process.on("error", async (err) => { console.log(err) });
process.on("unhandledRejection", async (reason, promise) => { console.log(reason) });
process.on("uncaughtException", async (err, origin) => { console.log(err) });
process.on("uncaughtExceptionMonitor", async (err, origin) => { console.log(err) });
process.on("warning", async (warn) => { console.log(warn) });
client.on("messageCreate", async message => {
   if (!message.guild || message.author.bot) return;

  const args = message.content.slice('').trim().split(/ +/);
  const command = args.shift().toLowerCase();



  if (command === '-help') {
    try {
       const embed = new EmbedBuilder()
         .setColor(0xffffff)
         .setTitle('Help Menu')
         .setDescription(`
                  **__
> - هلا والله

> - طلبت المساعده؟ 

> - اختر الامر الي تريد المساعده فيه

__**
                         `)
         .setImage('https://cdn.discordapp.com/attachments/1254569003607789609/1264648863202021396/5b7fc1c6f50ed1c1.png-1.webp?ex=66a1ef49&is=66a09dc9&hm=5dadbe332ef94d4f8e4b089eeb59cabd6eb4966d672cb02a9735a4a7cdb15493&')
       const menu = new StringSelectMenuBuilder()
        .setCustomId('helpMenu')
        .setPlaceholder('Choose the item you want.')
        .addOptions(
          {
            label: 'اوامر المتاجر',
            value: 'stores'
          },
          {
            label: 'اوامر الاونر',
            value: 'owner'
          },
          {
            label: 'اوامر الاداره',
            value: 'system'
          },
          {
            label: 'اوامر الالعاب',
            value: 'gems'
          }
        )
      const row = new ActionRowBuilder()
        .addComponents(menu)
      await message.reply({ embeds: [embed], components: [row] });
     } catch (error) {
        console.error(error);
     }
   }
 });
client.on('interactionCreate', async interaction => {
const descriptions = {
  stores: `**__

## اوامر المتاجر هي:

### </shop-mentions:0>

ل اظهار المنشن

### </category-mentions:0>

لتحديد منشنات في كتاغوري محدد

### </shop:0>

ل انشاء متجر في كتاغوري محدد

### </set-mention:0>

لتحديد منشنات متجر معين

### </give-role:0>

ل اعطاء رتبه مؤقته لشخص محدد

(لازم رتبة البوت اعلى من الشخص + من الرتبه الي راح تعطيها للشخص

__**`,
  owner: `لا يوجد`,
  system: `**__
لايوحد
__**`,
  gems: `لا يوجد`
  }
//You must add the description for each embed in these definitions
  if (!interaction.isStringSelectMenu()) return;
   if (interaction.customId === 'helpMenu') {
     try {
       const embed = new EmbedBuilder()
         .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
         .setColor(0xffffff)
         .setDescription(descriptions[interaction.values[0]])
         .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
         .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
    await interaction.reply({ embeds: [embed], ephemeral: true });
     } catch (error) {
       console.error(error);
       await interaction.reply({ content: 'An error occurred while using the menu.', ephemeral: true });
     }
   }
});
