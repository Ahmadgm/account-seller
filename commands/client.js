const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction } = require('discord.js')
const settings = require('../data/database/sqlite').settings;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('client')
        .setDescription('set the client(s) role!')
        .addRoleOption(option =>
            option.setName('role')
            .setDescription('the role the client will get it')
            .setRequired(true)
        ),

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async(client, interaction) => {
        if (settings.fetch(`Status`) !== "enable") return interaction.reply({
            content: "server buy system is disabled ⚠️",
            allowMention: {
                repliedUser: false
            },
            ephemeral: true,
            components: []
        });
        try {
            let role = interaction.options.getRole('role');
            settings.set(`ClientRole`, role.id);
            interaction.reply({
                content: "**" + role.name + "** has set as a client role!",
                allowMention: {
                    repliedUser: false
                },
                ephemeral: true,
                components: []
            });
        } catch (err) {
            console.log(err)
                // process.exit(1)
        }
    }
}