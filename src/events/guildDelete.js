const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logs');

module.exports = {
  name: 'guildDelete',
  async execute(guild, client) {
    const embed = new EmbedBuilder()
      .setTitle('🔴 Server rimosso')
      .setDescription(`Il bot è stato rimosso da un server.`)
      .addFields(
        { name: 'Nome', value: `${guild.name}`, inline: true },
        { name: 'ID', value: `${guild.id}`, inline: true },
        { name: 'Membri stimati', value: `${guild.memberCount || 'N/D'}`, inline: true }
      )
      .setColor(0xED4245)
      .setTimestamp();

    await sendLog(client, 'server', embed, null);
  }
};
