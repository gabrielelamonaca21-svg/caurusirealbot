const { EmbedBuilder } = require('discord.js');
const { sendLog, getChannelTypeName } = require('../utils/logs');

module.exports = {
  name: 'channelCreate',
  async execute(channel, client) {
    if (!channel.guild) return;

    const embed = new EmbedBuilder()
      .setTitle('📌 Canale creato')
      .setDescription(`Un nuovo canale è stato creato.`)
      .addFields(
        { name: 'Nome', value: `${channel.name}`, inline: true },
        { name: 'ID', value: `${channel.id}`, inline: true },
        { name: 'Tipo', value: `${getChannelTypeName(channel.type)}`, inline: true },
        { name: 'Categoria', value: channel.parent ? `${channel.parent.name}` : 'Nessuna', inline: true }
      )
      .setColor(0x5865F2)
      .setTimestamp();

    await sendLog(client, 'channels', embed, `Canale creato in **${channel.guild.name}**.`);
  }
};
