const { EmbedBuilder } = require('discord.js');
const { sendLog, getChannelTypeName } = require('../utils/logs');

function buildChanges(oldChannel, newChannel) {
  const changes = [];

  if (oldChannel.name !== newChannel.name) {
    changes.push(`Nome: \`${oldChannel.name}\` → \`${newChannel.name}\``);
  }

  if (oldChannel.type !== newChannel.type) {
    changes.push(`Tipo: \`${getChannelTypeName(oldChannel.type)}\` → \`${getChannelTypeName(newChannel.type)}\``);
  }

  if ((oldChannel.parentId || '') !== (newChannel.parentId || '')) {
    const oldParent = oldChannel.parent ? oldChannel.parent.name : 'Nessuna';
    const newParent = newChannel.parent ? newChannel.parent.name : 'Nessuna';
    changes.push(`Categoria: \`${oldParent}\` → \`${newParent}\``);
  }

  if (oldChannel.topic !== newChannel.topic) {
    changes.push(`Argomento: \`${oldChannel.topic || 'N/D'}\` → \`${newChannel.topic || 'N/D'}\``);
  }

  return changes;
}

module.exports = {
  name: 'channelUpdate',
  async execute(oldChannel, newChannel, client) {
    if (!newChannel.guild) return;

    const changes = buildChanges(oldChannel, newChannel);
    if (changes.length === 0) return;

    const embed = new EmbedBuilder()
      .setTitle('✏️ Canale aggiornato')
      .setDescription(`Un canale è stato aggiornato.`)
      .addFields(
        { name: 'Nome', value: `${newChannel.name}`, inline: true },
        { name: 'ID', value: `${newChannel.id}`, inline: true },
        { name: 'Modifiche', value: changes.join('\n'), inline: false }
      )
      .setColor(0xFAA61A)
      .setTimestamp();

    await sendLog(client, 'channels', embed, `Canale aggiornato in **${newChannel.guild.name}**.`);
  }
};
