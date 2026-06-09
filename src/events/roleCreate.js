const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logs');

module.exports = {
  name: 'roleCreate',
  async execute(role, client) {
    const embed = new EmbedBuilder()
      .setTitle('🆕 Ruolo creato')
      .setDescription(`Un nuovo ruolo è stato creato in **${role.guild.name}**.`)
      .addFields(
        { name: 'Nome', value: `${role.name}`, inline: true },
        { name: 'ID', value: `${role.id}`, inline: true },
        { name: 'Colore', value: `${role.hexColor}`, inline: true },
        { name: 'Menzionabile', value: `${role.mentionable ? 'Sì' : 'No'}`, inline: true }
      )
      .setColor(0x57F287)
      .setTimestamp();

    await sendLog(client, 'roles', embed, null);
  }
};
