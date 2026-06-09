const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logs');

function buildChanges(oldRole, newRole) {
  const changes = [];

  if (oldRole.name !== newRole.name) {
    changes.push(`Nome: \`${oldRole.name}\` → \`${newRole.name}\``);
  }

  if (oldRole.color !== newRole.color) {
    changes.push(`Colore: \`${oldRole.hexColor}\` → \`${newRole.hexColor}\``);
  }

  if (oldRole.hoist !== newRole.hoist) {
    changes.push(`Mostrato separatamente: \`${oldRole.hoist ? 'Sì' : 'No'}\` → \`${newRole.hoist ? 'Sì' : 'No'}\``);
  }

  if (oldRole.mentionable !== newRole.mentionable) {
    changes.push(`Menzionabile: \`${oldRole.mentionable ? 'Sì' : 'No'}\` → \`${newRole.mentionable ? 'Sì' : 'No'}\``);
  }

  if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
    changes.push('Permessi aggiornati');
  }

  return changes;
}

module.exports = {
  name: 'roleUpdate',
  async execute(oldRole, newRole, client) {
    const changes = buildChanges(oldRole, newRole);
    if (changes.length === 0) return;

    const embed = new EmbedBuilder()
      .setTitle('✏️ Ruolo aggiornato')
      .setDescription(`Un ruolo è stato aggiornato in **${newRole.guild.name}**.`)
      .addFields(
        { name: 'Nome', value: `${newRole.name}`, inline: true },
        { name: 'ID', value: `${newRole.id}`, inline: true },
        { name: 'Modifiche', value: changes.join('\n'), inline: false }
      )
      .setColor(0xFAA61A)
      .setTimestamp();

    await sendLog(client, 'roles', embed, null);
  }
};
