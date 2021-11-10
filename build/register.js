const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const chalk = require('chalk');

/**
 * 
 * @param {Client} client 
 * @param {__dirname} dirname 
 * @param {Array} commands 
 * @param {Array} commandsInfo 
 */

module.exports = async(client, dirname, commands, commandsInfo) => {
    require('../server/server')();
    const commandFiles = fs.readdirSync(dirname + '/commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(dirname + `/commands/${file}`);
        commands.push(command.data.toJSON());
        commandsInfo.push(file);
    }

    const rest = new REST({ version: '9' }).setToken(client.token);

    (async() => {
        try {
            console.log(chalk.yellow('Started refreshing application (/) commands.'));

            await rest.put(
                Routes.applicationCommands(client.user.id), { body: commands },
            );

            console.log(chalk.red("this bot has mad by Krypton000: https://github.com/Krypton000/Krypton000"))
            console.log(chalk.green('Successfully reloaded application (/) commands.'));
            console.log(chalk.yellow.bold(client.user.username) + chalk.red(' is ready'));
        } catch (error) {
            console.error(chalk.red(error));
        }
    })();
}