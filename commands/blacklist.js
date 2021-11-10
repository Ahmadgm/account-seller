const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction } = require('discord.js')
const admins = require('../config').admins;
const db = require('../data/database/sqlite').settings;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('add/remove/reset someone to blacklist!')
        .addStringOption(option =>
            option.setName('type')
            .setDescription('you won\'t add or remove or reset?')
            .setRequired(true)
            .addChoice('add', 'add')
            .addChoice('remove', 'remove')
            .addChoice('reset', 'reset')
        )
        .addUserOption(option =>
            option.setName('user')
            .setDescription('the one you will add')
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
        let data = db.fetch('BlackList');
        let type = interaction.options.getString('type');
        let user = interaction.options.getUser('user') || interaction.user;
        if (type == "add") {
            if (data == null) db.set('BlackList', [`${user.id}`]);
            else db.push('BlackList', user.id)
            interaction.reply({
                content: "**" + user.username + "** has added from blacklist ✅",
                allowMention: {
                    repliedUser: false
                },
                ephemeral: true,
                components: []
            });
        } else if (type == "remove") {
            if (data == null || !data.includes(user.id)) interaction.reply({
                content: "this user is not from blacklist ✅",
                allowMention: {
                    repliedUser: false
                },
                ephemeral: true,
                components: []
            });
            else {
                let array = [];
                for (i = 0; i < data.length; i++) {
                    if (data[i] !== user.id) array.push(data[i]);
                }
                db.set('BlackList', array);
                interaction.reply({
                    content: "**" + user.username + "** has removed from blacklist ✅",
                    allowMention: {
                        repliedUser: false
                    },
                    ephemeral: true,
                    components: []
                });
            }
        } else if (type == "reset") {
            db.set('BlackList', []);
            interaction.reply({
                content: "all of the blacklist users has removed ✅",
                allowMention: {
                    repliedUser: false
                },
                ephemeral: true,
                components: []
            });
        }
    }
}