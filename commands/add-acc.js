const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageButton, MessageActionRow, Client, CommandInteraction } = require('discord.js')
const admins = require('../config').admins;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-acc')
        .setDescription('add an category!')
        .addStringOption(option =>
            option.setName('category_name')
            .setDescription('The category name')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('acc_data')
            .setDescription('The account mail and password like: bot_selling_accounts@gmail.com:1325542')
            .setRequired(true)),

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async(client, interaction, db) => {
        if (!admins.includes(interaction.user.id)) return interaction.reply({
            content: "**you must be an admin to use this command 🚨**",
            allowMention: {
                repliedUser: false
            },
            ephemeral: true,
            components: []
        });
        var i = false;
        var array = [];
        if (db.fetch(interaction.options.getString('category_name')) == null) {
            interaction.reply({
                content: "**this category is not found please check the category name again ⚠️**",
                allowMention: {
                    repliedUser: false
                },
                ephemeral: true,
                components: []
            });
        } else {
            for (num = 0; num < db.fetch(interaction.options.getString('category_name')).acc.length; num++) {
                if (db.fetch(interaction.options.getString('category_name')).acc[num] == interaction.options.getString('acc_data')) {
                    i = true;
                }
            }
            setTimeout(async() => {
                if (i) {
                    let x = new MessageButton()
                        .setCustomId('x')
                        .setEmoji('❎')
                        .setStyle('DANGER');
                    let o = new MessageButton()
                        .setCustomId('o')
                        .setEmoji('✅')
                        .setStyle('SUCCESS');
                    let row = new MessageActionRow()
                        .addComponents(x, o);
                    let msg = await interaction.reply({
                        content: "**this acc is already detected 🕵️‍♂️**\n you can press \"❎\" to stop the process\nor press \"✅\" to delete the acc",
                        allowMention: {
                            repliedUser: false
                        },
                        ephemeral: true,
                        components: [row]
                    });
                    const filter = i => i.user.id == interaction.user.id;
                    const collector = await interaction.channel.createMessageComponentCollector({ filter, time: 0 });

                    collector.on('collect', async i => {
                        i.deferReply().catch(() => {});
                        if (i.customId == 'x') {
                            interaction.editReply({
                                content: "**👌 Button Has Clicked!.**",
                                allowMention: {
                                    repliedUser: false
                                },
                                ephemeral: true,
                                components: []
                            });
                            await i.followUp({
                                content: "**✅ Process has canceld**",
                                allowMention: {
                                    repliedUser: false
                                },
                                ephemeral: true,
                                components: []
                            });
                        } else if (i.customId == 'o') {
                            for (num = 0; num < db.fetch(interaction.options.getString('category_name')).acc.length; num++) {
                                if (db.fetch(interaction.options.getString('category_name')).acc[num] == interaction.options.getString('acc_data')) continue;
                                array.push(db.fetch(interaction.options.getString('category_name')).acc[num])
                            }
                            let oldData = db.fetch(interaction.options.getString('category_name'));
                            await db.set(interaction.options.getString('category_name'), {
                                acc: array,
                                price: oldData.price,
                                style: oldData.style
                            });
                            interaction.editReply({
                                content: "**👌 Button Has Clicked!.**",
                                allowMention: {
                                    repliedUser: false
                                },
                                ephemeral: true,
                                components: []
                            });
                            await i.followUp({
                                content: "**✅ Data has deleted!.**",
                                allowMention: {
                                    repliedUser: false
                                },
                                ephemeral: true,
                                components: []
                            });
                        }
                    });
                } else {
                    db.push(`${interaction.options.getString('category_name')}.acc`, interaction.options.getString('acc_data') || "None!");
                    interaction.reply({
                        content: "**account has added!. 🎉\n**`" + interaction.options.getString('category_name') + "`  has an `" + db.fetch(interaction.options.getString('category_name')).acc.length + "` account",
                        allowMention: {
                            repliedUser: false
                        },
                        ephemeral: true
                    });
                }
            }, 1666)
        }
    }
}