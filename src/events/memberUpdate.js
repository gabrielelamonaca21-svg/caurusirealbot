const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logs');

module.exports = {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember, client) {
    if (oldMember.user.bot) return;

    const changes = [];

    if (oldMember.nickname !== newMember.nickname) {
      changes.push('Nickname: `' + (oldMember.nickname || 'Nessuno') + '` → `' + (newMember.nickname || 'Nessuno') + '`');
    }

    if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
      const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
      const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));
      
      if (addedRoles.size > 0) {
        changes.push('Ruoli aggiunti: ' + addedRoles.map(r => '`' + r.name + '`').join(', '));
      }
      if (removedRoles.size > 0) {
        changes.push('Ruoli rimossi: ' + removedRoles.map(r => '`' + r.name + '`').join(', '));
      }
    }

    if (changes.length === 0) return;

    const embed = new EmbedBuilder()
      .setTitle('👤 Membro aggiornato')
      .setDescription(`Aggiornamenti per ${newMember}`)
      .addFields(
        { name: 'Utente', value: `${newMember.user.tag}`, inline: true },
        { name: 'ID', value: `${newMember.id}`, inline: true },
        { name: 'Modifiche', value: changes.join('\n'), inline: false }
      )
      .setColor(0xFAA61A)
      .setTimestamp();

    await sendLog(client, 'server', embed, null);
  }
};
