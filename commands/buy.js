const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageSelectMenu, MessageActionRow, MessageEmbed, Client, CommandInteraction } = require('discord.js')
const botID = require('../config').botID;
const transID = require('../config').transID;
const nProtect = new Set();
const settings = require('../data/database/sqlite').settings;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('buy an account(s)!'),

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async(client, interaction, db) => {
        if (settings.fetch(`Status`) !== "enable") return interaction.reply({
            content: "server buy system is disabled ⚠️",
            allowMention: {
                repliedUser: false
            },
            ephemeral: true,
            components: []
        });
        try {
            if (nProtect.has(interaction.user.id)) {
                interaction.reply({
                    content: "There a **process** in load out ⚠️",
                    allowMention: {
                        repliedUser: false
                    },
                    ephemeral: true,
                    components: []
                });
                return
            }
            let selecorArray = [];
            db.all().map((value, i) => {
                let data = db.fetch(value.ID);
                selecorArray.push({
                    label: String(data.style + " " + value.ID),
                    description: String(data.acc ? data.acc.length : 0 + " | " + data ? data.price : 0 + "$"),
                    value: String(i),
                })
            });
            let selector = new MessageSelectMenu()
                .setCustomId('select')
                .setMinValues(1)
                .setMaxValues(1)
                .setPlaceholder('Nothing selected')
                .addOptions(selecorArray);
            let row = new MessageActionRow()
                .addComponents(selector);
            let msg = await interaction.reply({
                content: "Please Choose An Account Category You Won't To Buy From ️🤞",
                allowMention: {
                    repliedUser: false
                },
                ephemeral: true,
                components: [row]
            });
            const filter = i => i.user.id == interaction.user.id;
            const collector = await interaction.channel.createMessageComponentCollector({ filter, time: 0 });

            collector.on('collect', async i => {
                let cat = db.all()[i.values[0]]
                let data = db.fetch(cat.ID);
                i.update({
                    content: "You Have 1m To Type How Many Accounts You Will Buy ️🤞",
                    allowMention: {
                        repliedUser: false
                    },
                    ephemeral: true,
                    components: []
                });
                const filter = i => i.author.id == interaction.user.id;
                interaction.channel.awaitMessages({ filter, max: 1, time: 1000 * 60, errors: ['time'] })
                    .then(async collected => {
                        collected.first().delete()
                        if (collected.first().content == 0) {
                            interaction.editReply({
                                content: "**you can't buy an 0 accounts ._. ⚠️**",
                                allowMention: {
                                    repliedUser: false
                                },
                                ephemeral: true,
                                components: []
                            });
                            return
                        }
                        if (Number(data.acc.length) >= Number(collected.first().content)) {
                            let newArray = [];
                            let payArray = [];
                            for (let i = 0; i < Number(collected.first().content); i++) {
                                payArray.push(data.acc[i])
                            }
                            for (let i = 0; i < Number(data.acc.length); i++) {
                                if (payArray.includes(data.acc[i])) continue
                                newArray.push(data.acc[i])
                            }
                            nProtect.add(interaction.user.id);
                            interaction.editReply({
                                content: `⚠️ **Please Make Sure The Probot Lang Is English! and your dm is opend** ⚠️\nYou Have 2m To Type: \`#credits ${transID} ${data.price}\``,
                                allowMention: {
                                    repliedUser: false
                                },
                                ephemeral: true,
                                components: []
                            });
                            const tax = require('probot-tax-calculator');
                            const result = tax(data.price);
                            const filter = i => i.author.id == botID && i.content.startsWith(`**:moneybag: | ${interaction.user.username}, has transferred `) && i.content.includes(Number(data.price) - Number(result.protax));
                            interaction.channel.awaitMessages({ filter, max: 1, time: 1000 * 60 * 2, errors: ['time'] })
                                .then(async() => {
                                    interaction.editReply({
                                        content: `Check Your **DM!** ⚠️`,
                                        allowMention: {
                                            repliedUser: false
                                        },
                                        ephemeral: true,
                                        components: []
                                    });
                                    console.log(payArray)
                                    for (let i = 0; i < payArray.length; i++) {
                                        interaction.user.send(`**${data.style} | ${cat.ID}**\n${payArray[i]}`).catch(() => {})
                                    }
                                    let log = client.channels.cache.get(settings.fetch('Logs'));
                                    if (log) {
                                        log.send(`🧾 **${data.style} | ${cat.ID}**\nby: <@${interaction.user.id}>\ndata: ${payArray.map(v => v).join('\n')}`).catch(() => {});
                                    }
                                    let role = interaction.guild.roles.cache.get(settings.fetch('ClientRole'));
                                    if (role) {
                                        let member = interaction.guild.member(interaction.user);
                                        member.roles.add(role)
                                    }
                                    await db.set(cat.ID, {
                                        acc: newArray,
                                        price: data.price,
                                        style: data.style
                                    });
                                    nProtect.delete(interaction.user.id);
                                })
                                .catch(collected => {
                                    console.log(collected)
                                    i.editReply(`Time Out ⏱️`)
                                });
                        } else {
                            interaction.editReply({
                                content: `**the category dose not have \`${collected.first().content}\` accounts ⚠️**`,
                                allowMention: {
                                    repliedUser: false
                                },
                                ephemeral: true,
                                components: []
                            });
                        }
                    })
                    .catch(collected => {
                        nProtect.delete(interaction.user.id);
                        i.editReply(`Time Out ⏱️`)
                    });
            });
        } catch (err) {
            console.log(err)
                // process.exit(1)
        }
    }
}