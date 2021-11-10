const { Client } = require('discord.js');
const chalk = require('chalk');
var client;
try {
    client = new Client({
        intents: require('../data/intents'),
        partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
        allowedMentions: {
            parse: ["users", "roles"],
            repliedUser: false
        }
    });
} catch { console.log(chalk.red('Failed to create a client')) }

module.exports = client