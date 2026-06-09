const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logs');

module.exports = {
  name: 'guildCreate',
  async execute(guild, client) {
    const embed = new EmbedBuilder()
      .setTitle('🟢 Server aggiunto')
      .setDescription(`Il bot è stato aggiunto a un nuovo server.`)
      .addFields(
        { name: 'Nome', value: `${guild.name}`, inline: true },
        { name: 'ID', value: `${guild.id}`, inline: true },
        { name: 'Membri stimati', value: `${guild.memberCount || 'N/D'}`, inline: true }
      )
      .setColor(0x57F287)
      .setTimestamp();

    await sendLog(client, 'server', embed, null);
  }
};
