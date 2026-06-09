const { EmbedBuilder } = require('discord.js');
const { sendLog, getChannelTypeName } = require('../utils/logs');

module.exports = {
  name: 'channelDelete',
  async execute(channel, client) {
    if (!channel.guild) return;

    const embed = new EmbedBuilder()
      .setTitle('🗑️ Canale eliminato')
      .setDescription(`Un canale è stato eliminato.`)
      .addFields(
        { name: 'Nome', value: `${channel.name}`, inline: true },
        { name: 'ID', value: `${channel.id}`, inline: true },
        { name: 'Tipo', value: `${getChannelTypeName(channel.type)}`, inline: true },
        { name: 'Categoria', value: channel.parent ? `${channel.parent.name}` : 'Nessuna', inline: true }
      )
      .setColor(0xED4245)
      .setTimestamp();

    await sendLog(client, 'channels', embed, `Canale eliminato in **${channel.guild.name}**.`);
  }
};
