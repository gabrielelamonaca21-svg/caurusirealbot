const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logs');

module.exports = {
  name: 'roleDelete',
  async execute(role, client) {
    const embed = new EmbedBuilder()
      .setTitle('🗑️ Ruolo eliminato')
      .setDescription(`Un ruolo è stato eliminato da **${role.guild.name}**.`)
      .addFields(
        { name: 'Nome', value: `${role.name}`, inline: true },
        { name: 'ID', value: `${role.id}`, inline: true },
        { name: 'Colore', value: `${role.hexColor}`, inline: true }
      )
      .setColor(0xED4245)
      .setTimestamp();

    await sendLog(client, 'roles', embed, null);
  }
};
