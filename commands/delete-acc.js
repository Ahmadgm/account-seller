const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction } = require('discord.js')
const admins = require('../config').admins;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-acc')
        .setDescription('delete an category!')
        .addStringOption(option =>
            option.setName('category_name')
            .setDescription('The category name')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('acc_data')
            .setDescription('The account you won\'t to delete')
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
        let data = db.fetch(interaction.options.getString('category_name'));
        if (data == null) {
            interaction.reply({
                content: "**this category is not found please check the category name again ⚠️**",
                allowMention: {
                    repliedUser: false
                },
                ephemeral: true,
                components: []
            });
        } else {
            let array = [];
            let i;
            for (num = 0; num < data.acc.length; num++) {
                if (data.acc[num] == interaction.options.getString('acc_data')) {
                    i = true
                } else {
                    array.push(data.acc[num])
                }
            }
            await db.set(interaction.options.getString('category_name'), {
                acc: array,
                price: data.price,
                style: data.style
            });
            setTimeout(async() => {
                if (i) {
                    await interaction.reply({
                        content: `**${interaction.options.getString('acc_data')}** has deleted from \`${interaction.options.getString('category_name')}\` ✅`,
                        allowMention: {
                            repliedUser: false
                        },
                        ephemeral: true,
                        components: []
                    });
                } else {
                    await interaction.reply({
                        content: `**i can't find this account ❎**`,
                        allowMention: {
                            repliedUser: false
                        },
                        ephemeral: true,
                        components: []
                    });
                }
            }, 1666)
        }
    }
}