const commands = [];
const commandsInfo = [];
const client = require('./client/discord');
const database = require('./data/database/sqlite');
require('./build/login')(client);

client.on('ready', () => require('./build/register')(client, __dirname, commands, commandsInfo));

client.on('interactionCreate', (i) => {
    let admins = require('./config').admins;
    let blacklist = database.settings.fetch(`BlackList`);
    if (blacklist !== null) {
        if (blacklist.includes(i.user.id) && !admins.includes(i.user.id)) return i.reply({ content: "❎ you got blacklisted", allowMention: { repliedUser: false }, ephemeral: true, });
    }
    if (!i.isCommand()) return;
    for (let num = 0; num < commands.length; num++) {
        if (i.commandName == commands[num].name) {
            require('./commands/' + commandsInfo[num]).run(client, i, database.accounts);
        }
    }
});