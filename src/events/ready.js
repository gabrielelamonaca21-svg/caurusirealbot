const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logs');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Bot connesso come ${client.user.tag}`);

    process.on('unhandledRejection', async (reason) => {
      const embed = new EmbedBuilder()
        .setTitle('💥 Promise non gestita')
        .setDescription('È stata catturata una promise non gestita.')
        .addFields(
          { name: 'Errore', value: `\`\`\`${String(reason).slice(0, 1020)}\`\`\``, inline: false }
        )
        .setColor(0xED4245)
        .setTimestamp();

      await sendLog(client, 'console', embed, null);
      console.error(reason);
    });

    process.on('uncaughtException', async (error) => {
      const embed = new EmbedBuilder()
        .setTitle('💥 Eccezione non catturata')
        .setDescription('Si è verificata un eccezione non catturata nel processo.')
        .addFields(
          { name: 'Errore', value: `\`\`\`${String(error).slice(0, 1020)}\`\`\``, inline: false }
        )
        .setColor(0xED4245)
        .setTimestamp();

      await sendLog(client, 'console', embed, null);
      console.error(error);
      process.exit(1);
    });
  }
};
