const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logs');

function buildGuildChanges(oldGuild, newGuild) {
  const changes = [];

  if (oldGuild.name !== newGuild.name) {
    changes.push(`Nome: \\`${oldGuild.name}\\` → \\`${newGuild.name}\\``);
  }

  if (oldGuild.description !== newGuild.description) {
    changes.push(`Descrizione: \\`${oldGuild.description || 'N/D'}\\` → \\`${newGuild.description || 'N/D'}\\``);
  }

  if (oldGuild.icon !== newGuild.icon) {
    changes.push('Icona server aggiornata');
  }

  if (oldGuild.preferredLocale !== newGuild.preferredLocale) {
    changes.push(`Lingua: \\`${oldGuild.preferredLocale}\\` → \\`${newGuild.preferredLocale}\\``);
  }

  if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
    changes.push(`Livello verifica: \\`${oldGuild.verificationLevel}\\` → \\`${newGuild.verificationLevel}\\``);
  }

  if (oldGuild.defaultMessageNotifications !== newGuild.defaultMessageNotifications) {
    changes.push(`Notifiche predefinite: \\`${oldGuild.defaultMessageNotifications}\\` → \\`${newGuild.defaultMessageNotifications}\\``);
  }

  return changes;
}

module.exports = {
  name: 'guildUpdate',
  async execute(oldGuild, newGuild, client) {
    const changes = buildGuildChanges(oldGuild, newGuild);
    if (changes.length === 0) return;

    const embed = new EmbedBuilder()
      .setTitle('⚙️ Server aggiornato')
      .setDescription(`Il server **${newGuild.name}** ha subito modifiche.`)
      .addFields(
        { name: 'ID server', value: `${newGuild.id}`, inline: true },
        { name: 'Modifiche', value: changes.join('\n'), inline: false }
      )
      .setColor(0xFAA61A)
      .setTimestamp();

    await sendLog(client, 'server', embed, null);
  }
};
