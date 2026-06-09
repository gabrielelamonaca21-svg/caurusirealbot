const { EmbedBuilder } = require('discord.js');
const { sendLog, formatChannel } = require('../utils/logs');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState, client) {
    if (!newState.guild || newState.member.user.bot) return;

    let title;
    let description;
    const member = newState.member;
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    if (!oldChannel && newChannel) {
      title = '🔊 Join voce';
      description = `${member} è entrato in ${formatChannel(newChannel)}.`;
    } else if (oldChannel && !newChannel) {
      title = '🔇 Leave voce';
      description = `${member} è uscito da ${formatChannel(oldChannel)}.`;
    } else if (oldChannel && newChannel && oldChannel.id !== newChannel.id) {
      title = '🔁 Cambio canale voce';
      description = `${member} si è spostato da ${formatChannel(oldChannel)} a ${formatChannel(newChannel)}.`;
    } else {
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .addFields(
        { name: 'Utente', value: `${member}`, inline: true },
        { name: 'ID utente', value: `${member.id}`, inline: true },
        { name: 'Server', value: `${newState.guild.name}`, inline: false }
      )
      .setColor(0x57F287)
      .setTimestamp();

    await sendLog(client, 'voice', embed, null);
  }
};
