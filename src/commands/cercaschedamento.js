const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const SCHEDAMENTO_CHANNEL_ID = '1513019696272773280';
const ALLOWED_ROLE_ID = '1492540918245490800';

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

    if (!interaction.member.roles.cache.has(ALLOWED_ROLE_ID)) {
      return interaction.reply({ content: 'Non hai il permesso per usare questo comando.', ephemeral: true });
    }

    const searchId = interaction.options.getString('id').replace(/[<@!>]/g, '').trim();
    const archiveChannel = await guild.channels.fetch(SCHEDAMENTO_CHANNEL_ID).catch(() => null);
    if (!archiveChannel || !archiveChannel.isTextBased()) {
      return interaction.reply({ content: 'Canale di schedamento non trovato.', ephemeral: true });
    }

    let found = null;
    let lastId = null;
    const normalizedSearch = searchId.trim();

    while (!found) {
      const messages = await archiveChannel.messages.fetch({ limit: 100, before: lastId }).catch(() => null);
      if (!messages || messages.size === 0) break;

      found = messages.find(msg =>
        msg.embeds.length > 0 &&
        msg.embeds[0].fields.some(field =>
          field.name.toLowerCase().includes('id discord') && field.value.trim() === normalizedSearch
        )
      );

      if (!found) {
        lastId = messages.last()?.id;
        if (!lastId) break;
      }
    }

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
