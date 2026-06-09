const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const SCHEDAMENTO_CHANNEL_ID = '1513019696272773280';

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
    .addStringOption(option =>
      option.setName('foto').setDescription('URL dell\'immagine').setRequired(true)
    ),
  async execute(interactionOrMessage, args) {
    let interaction = null;
    let message = null;
    let replyFn = null;
    let authorId = null;
    let guild = null;

    if (interactionOrMessage.isChatInputCommand && interactionOrMessage.isChatInputCommand()) {
      interaction = interactionOrMessage;
      guild = interaction.guild;
      authorId = interaction.user.id;
      replyFn = async content => {
        if (interaction.replied || interaction.deferred) {
          return interaction.followUp(content);
        }
        return interaction.reply(content);
      };
      args = [
        interaction.options.getString('id'),
        interaction.options.getString('nomeds'),
        interaction.options.getString('nomecognome'),
        interaction.options.getString('nascita'),
        interaction.options.getString('foto')
      ];
    } else {
      message = interactionOrMessage;
      guild = message.guild;
      authorId = message.author.id;
      replyFn = content => message.reply(content);
    }

    if (!guild) {
      return replyFn({ content: 'Questo comando funziona solo in un server.', ephemeral: true });
    }

    if (!args || args.length < 5) {
      return replyFn({ content: 'Uso: /schedamento [id] [nomeds] [nomecognome] [nascita] [foto]', ephemeral: true });
    }

    const discordId = args[0];
    const nomeDs = args[1];
    const nomeCognome = args[2];
    const nascita = args[3];
    const fotoUrl = args[4];

    const archiveChannel = guild.channels.cache.get(SCHEDAMENTO_CHANNEL_ID);
    if (!archiveChannel) {
      return replyFn({ content: 'Canale di schedamento non trovato.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('📋 Schedamento')
      .setDescription(`Schedamento registrato da: <@${authorId}>`)
      .setColor(0x5865F2)
      .addFields(
        { name: 'ID Discord', value: discordId, inline: true },
        { name: 'Nome DS', value: nomeDs, inline: true },
        { name: 'Nome e Cognome', value: nomeCognome, inline: false },
        { name: 'Data di nascita', value: nascita, inline: true }
      )
      .setImage(fotoUrl);

    await archiveChannel.send({ embeds: [embed] });
    return replyFn({ content: 'Schedamento inviato correttamente.', ephemeral: true });
  }
};
