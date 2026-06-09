const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logs');

module.exports = {
  name: 'warn',
  async execute(info, client) {
    const embed = new EmbedBuilder()
      .setTitle('⚠️ Avviso client')
      .setDescription('Discord ha generato un avviso.')
      .addFields(
        { name: 'Avviso', value: `\`\`\`${String(info).slice(0, 1020)}\`\`\``, inline: false }
      )
      .setColor(0xF1C40F)
      .setTimestamp();

    await sendLog(client, 'console', embed, null);
    console.warn(info);
  }
};
