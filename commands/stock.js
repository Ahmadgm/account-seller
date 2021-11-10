const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Client, CommandInteraction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stock')
    .setDescription('the avilable accounts and category!'),

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction, db) => {
    try {
    let embed = new MessageEmbed()
    .setColor("ORANGE")
    .setAuthor("~ Stock", interaction.guild.iconURL())
    db.all().forEach(value => {
      let data = db.fetch(value.ID)
      console.log(data)
      embed.addFields({
        name: String(data.style + " " + value.ID),
        value: String("`" + data.acc.length + "` | `" + data.price + "`$"),
        inline: true
      });
    });
    interaction.reply({
      embeds: [embed],
      allowMention: {
        repliedUser: false
      },
      ephemeral: true,
      components: []
    });
    } catch (err) {
      console.log(err)
      interaction.reply({
       content: "thare are no data 🚨",
       allowMention: {
         repliedUser: false
       },
       ephemeral: true,
        components: []
      });
    }
  }
}