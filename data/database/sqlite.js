const db = require('quick.db');
const accounts = new db.table('accounts');
const settings = new db.table('settings');
console.log(accounts.all())
console.log(settings.all())

module.exports.accounts = accounts;
module.exports.settings = settings;