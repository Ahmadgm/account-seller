const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageButton, MessageActionRow, Client, CommandInteraction } = require('discord.js')
const admins = require('../config').admins;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-category')
        .setDescription('delete an category!')
        .addStringOption(option =>
            option.setName('category_name')
            .setDescription('The category name')
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
                content: "**safty check 🕵️‍♂️**\npress \"✅\" if you are sure\npress \"❎\" if you are not sure\n(when you delete the category you will delete all the data inside)",
                allowMention: {
                    repliedUser: false
                },
                ephemeral: true,
                components: [row]
            });
            const filter = i => i.user.id == interaction.user.id;
            const collector = await interaction.channel.createMessageComponentCollector({ filter, time: 0 });

            collector.on('collect', async i => {
                if (i.customId == 'x') {
                    interaction.editReply({
                        content: "**✅ Process has canceld**",
                        allowMention: {
                            repliedUser: false
                        },
                        ephemeral: true,
                        components: []
                    });
                } else if (i.customId == 'o') {
                    await db.delete(interaction.options.getString('category_name'));
                    interaction.editReply({
                        content: "**✅ Data has removed!.**",
                        allowMention: {
                            repliedUser: false
                        },
                        ephemeral: true,
                        components: []
                    });
                }
            });
        } else {
            interaction.reply({
                content: "**" + interaction.options.getString('category_name') + "** is not on the stock ❎",
                allowMention: {
                    repliedUser: false
                },
                ephemeral: true
            });
        }
    }
}