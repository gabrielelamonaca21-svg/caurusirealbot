const { EmbedBuilder } = require('discord.js');

const SCHEDAMENTO_CHANNEL_ID = '1513019696272773280';

module.exports = {
  name: 'schedamento',
  description: 'Registra uno schedamento nel canale dedicato.',
  async execute(message, args) {
    if (args.length < 5) {
      return message.reply(
        'Uso: !schedamento [id] [nomeds] [nomecognome] [nascita] [foto]'
      );
    }

    const discordId = args.shift();
    const fotoUrl = args.pop();
    const nascita = args.pop();
    const nomeDs = args.shift();
    const nomeCognome = args.join(' ');

    if (!discordId || !nomeDs || !nomeCognome || !nascita || !fotoUrl) {
      return message.reply(
        'Uso: !schedamento [id] [nomeds] [nomecognome] [nascita] [foto]'
      );
    }

    const archiveChannel = message.guild.channels.cache.get(SCHEDAMENTO_CHANNEL_ID);
    if (!archiveChannel) {
      return message.reply('Canale di schedamento non trovato.');
    }

    const embed = new EmbedBuilder()
      .setTitle('📋 Schedamento')
      .setDescription(`Schedamento registrato da: <@${message.author.id}>`)
      .setColor(0x5865F2)
      .addFields(
        { name: 'ID Discord', value: discordId, inline: true },
        { name: 'Nome DS', value: nomeDs, inline: true },
        { name: 'Nome e Cognome', value: nomeCognome, inline: false },
        { name: 'Data di nascita', value: nascita, inline: true }
      )
      .setImage(fotoUrl);

    await archiveChannel.send({ embeds: [embed] });
    return message.reply('Schedamento inviato correttamente.');
  }
};
