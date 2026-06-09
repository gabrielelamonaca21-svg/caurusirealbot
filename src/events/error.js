const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logs');

module.exports = {
  name: 'error',
  async execute(error, client) {
    const embed = new EmbedBuilder()
      .setTitle('❌ Errore client')
      .setDescription('Si è verificato un errore nel client Discord.')
      .addFields(
        { name: 'Errore', value: `\`\`\`${String(error).slice(0, 1020)}\`\`\``, inline: false }
      )
      .setColor(0xED4245)
      .setTimestamp();

    await sendLog(client, 'console', embed, null);
    console.error(error);
  }
};
