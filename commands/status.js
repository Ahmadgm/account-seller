const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction } = require('discord.js')
const admins = require('../config').admins;
const db = require('../data/database/sqlite').settings;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('lock or unlock the buy system!')
        .addStringOption(option =>
            option.setName('status')
            .setDescription('on/off')
            .setRequired(true)
            .addChoice('on', 'enable')
            .addChoice('off', 'disable')
        ),

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async(client, interaction) => {
        if (!admins.includes(interaction.user.id)) return interaction.reply({
            content: "**you must be an admin to use this command 🚨**",
            allowMention: {
                repliedUser: false
            },
            ephemeral: true,
            components: []
        });
        db.set(`Status`, interaction.options.getString("status"));
        interaction.reply({
            content: `**the buy status value has changed to: \`${interaction.options.getString("status")}\` 🚨**`,
            allowMention: {
                repliedUser: false
            },
            ephemeral: true,
            components: []
        });
    }
}