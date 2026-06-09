const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const SCHEDAMENTO_CHANNEL_ID = '1513019696272773280';

module.exports = {
  name: 'cercaschedamento',
  description: 'Cerca uno schedamento per ID Discord.',
  data: new SlashCommandBuilder()
    .setName('cercaschedamento')
    .setDescription('Cerca uno schedamento per ID Discord.')
    .addStringOption(option =>
      option.setName('id').setDescription('ID Discord da cercare').setRequired(true)
    ),
  async execute(interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Questo comando funziona solo in un server.', ephemeral: true });
    }

    const searchId = interaction.options.getString('id');
    const archiveChannel = guild.channels.cache.get(SCHEDAMENTO_CHANNEL_ID);
    if (!archiveChannel) {
      return interaction.reply({ content: 'Canale di schedamento non trovato.', ephemeral: true });
    }

    const messages = await archiveChannel.messages.fetch({ limit: 100 });
    const found = messages.find(msg =>
      msg.embeds.length > 0 &&
      msg.embeds[0].fields.some(field => field.name.includes('ID Discord') && field.value === searchId)
    );

    if (!found) {
      return interaction.reply({ content: `Nessuno schedamento trovato per ID ${searchId}.`, ephemeral: true });
    }

    const embed = found.embeds[0];
    const resultEmbed = new EmbedBuilder(embed.toJSON())
      .setTitle('🔍 Schedamento trovato')
      .setFooter({ text: `Cerca effettuata il ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}` });

    return interaction.reply({ embeds: [resultEmbed], ephemeral: true });
  }
};
