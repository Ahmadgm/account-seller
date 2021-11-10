const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction } = require('discord.js')
const admins = require('../config').admins;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('price')
        .setDescription('edit the category price!')
        .addStringOption(option =>
            option.setName('category_name')
            .setDescription('The category name')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('new_price')
            .setDescription('The new category price')
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
            let oldData = db.fetch(interaction.options.getString('category_name'));
            db.set(interaction.options.getString('category_name'), {
                acc: oldData.acc,
                price: interaction.options.getString('new_price'),
                style: oldData.style
            });
            interaction.reply({
                content: `**category price has changed to: \`${interaction.options.getString('new_price')}\` ✅**`,
                allowMention: {
                    repliedUser: false
                },
                ephemeral: true
            });
        } else {
            interaction.reply({
                content: "**i can't find this category 🚨**",
                allowMention: {
                    repliedUser: false
                },
                ephemeral: true
            });
        }
    }
}