const chalk = require('chalk');

module.exports = async(client) => {
    client.login(process.env.TOKEN).then(token => {
        console.log(chalk.red.bold('connecting to: ') + chalk.green(String(token).split('.')[0] + "*********************************"));
    }).catch((err) => {
        if (err.toString().includes("DISALLOWED_INTENTS")) console.log(chalk.red(`Please go to " https://discord.com/developers/applications/ "\nand choose your bot,\nthen go to bot option from the nav bar on the right,\nthen allow all the intents`));
        else if (err.toString().includes("TOKEN_INVALID")) console.log(chalk.red(`The bot token is invalid`));
        else console.log(chalk.red(err));
    });
}