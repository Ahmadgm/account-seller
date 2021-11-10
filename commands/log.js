const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction } = require('discord.js')
const admins = require('../config').admins;
const db = require('../data/database/sqlite').settings;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('set/remove the log channel!')
        .addStringOption(option =>
            option.setName('type')
            .setDescription('you won\'t set or remove?')
            .setRequired(true)
            .addChoice('set', 'set')
            .addChoice('remove', 'remove')
        )
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('the channel the bot will send in it the buy logs')
            .setRequired(false)
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
        let type = interaction.options.getString('type');
        let channel = interaction.options.getChannel('channel') || interaction.channel;
        if (type == "set") {
            db.set('Logs', channel.id);
            interaction.reply({
                content: "**" + channel.name + "** has set as log channel ✅",
                allowMention: {
                    repliedUser: false
                },
                ephemeral: true,
                components: []
            });
        } else if (type == "remove") {
            db.set('Logs', channel.id);
            interaction.reply({
                content: "**" + channel.name + "** has removed as log channel ✅",
                allowMention: {
                    repliedUser: false
                },
                ephemeral: true,
                components: []
            });
        }
    }
}