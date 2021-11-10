const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageButton, MessageActionRow, Client, CommandInteraction } = require('discord.js')
const admins = require('../config').admins;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-category')
        .setDescription('add an category!')
        .addStringOption(option =>
            option.setName('category_name')
            .setDescription('The category name')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('category_price')
            .setDescription('The category accounts price')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('category_style')
            .setDescription('The category emoji that will be in the menu')
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
        if (db.fetch(interaction.options.getString('category_name')) !== null) {
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
                content: "**this category name is already detected 🕵️‍♂️**\n you can press \"❎\" to stop the process\nor press \"✅\" to replace the category data (that will delete the accounts in the category)",
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
                    await db.set(interaction.options.getString('category_name'), {
                        acc: [],
                        price: interaction.options.getString('category_price'),
                        style: interaction.options.getString('category_style')
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
                        content: "**✅ Data has replaced!.**",
                        allowMention: {
                            repliedUser: false
                        },
                        ephemeral: true,
                        components: []
                    });
                }
            });
        } else {
            db.set(interaction.options.getString('category_name'), {
                acc: [],
                price: interaction.options.getString('category_price'),
                style: interaction.options.getString('category_style')
            });
            interaction.reply({
                content: "**" + interaction.options.getString('category_name') + "** category was added to the stock ✅",
                allowMention: {
                    repliedUser: false
                },
                ephemeral: true
            });
        }
    }
}