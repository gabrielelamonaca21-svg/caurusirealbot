const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const SCHEDAMENTO_CHANNEL_ID = '1513019696272773280';
const ALLOWED_ROLE_ID = '1492540918245490800';

module.exports = {
  name: 'schedamento',
  description: 'Registra uno schedamento nel canale dedicato.',
  data: new SlashCommandBuilder()
    .setName('schedamento')
    .setDescription('Registra uno schedamento nel canale dedicato.')
    .addStringOption(option =>
      option.setName('id').setDescription('ID Discord').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('nomeds').setDescription('Nome DS').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('nomecognome').setDescription('Nome e Cognome').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('nascita').setDescription('Data di nascita').setRequired(true)
    )
    .addAttachmentOption(option =>
      option.setName('foto').setDescription('Screenshot o foto').setRequired(true)
    ),
  async execute(interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'Questo comando funziona solo in un server.', ephemeral: true });
    }

    if (!interaction.member.roles.cache.has(ALLOWED_ROLE_ID)) {
      return interaction.reply({ content: 'Non hai il permesso per usare questo comando.', ephemeral: true });
    }

    const discordId = interaction.options.getString('id');
    const nomeDs = interaction.options.getString('nomeds');
    const nomeCognome = interaction.options.getString('nomecognome');
    const nascita = interaction.options.getString('nascita');
    const foto = interaction.options.getAttachment('foto');

    if (!discordId || !nomeDs || !nomeCognome || !nascita || !foto) {
      return interaction.reply({ content: 'Uso: /schedamento [id] [nomeds] [nomecognome] [nascita] [foto]', ephemeral: true });
    }

    const archiveChannel = guild.channels.cache.get(SCHEDAMENTO_CHANNEL_ID);
    if (!archiveChannel) {
      return interaction.reply({ content: 'Canale di schedamento non trovato.', ephemeral: true });
    }

    const createdAt = new Date();
    const createdAtLabel = createdAt.toLocaleString('it-IT', { timeZone: 'Europe/Rome' });

    const embed = new EmbedBuilder()
      .setTitle('📋📝 Schedamento Registrato')
      .setDescription(`✅ Schedamento registrato da: <@${interaction.user.id}>`)
      .setColor(0x5865F2)
      .addFields(
        { name: '🆔 ID Discord', value: discordId, inline: true },
        { name: '👤 Nome DS', value: nomeDs, inline: true },
        { name: '📝 Nome e Cognome', value: nomeCognome, inline: false },
        { name: '🎂 Data di nascita', value: nascita, inline: true }
      )
      .setImage(foto.url)
      .setTimestamp(createdAt)
      .setFooter({ text: `Registrato il ${createdAtLabel}` });

    await archiveChannel.send({ embeds: [embed] });
    return interaction.reply({ content: 'Schedamento inviato correttamente.', ephemeral: true });
  }
};
