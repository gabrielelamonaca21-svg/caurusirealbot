const { ChannelType, PermissionsBitField } = require('discord.js');
const ticketCategories = require('../config/tickets');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'ticket-category') return;

    const categoryId = interaction.values[0];
    const category = ticketCategories.find(c => c.id === categoryId);
    if (!category) {
      return interaction.reply({ content: 'Categoria ticket non trovata.', ephemeral: true });
    }

    if (!interaction.guild) {
      return interaction.reply({ content: 'Questo comando funziona solo in un server.', ephemeral: true });
    }

    const ticketName = `ticket-${category.id}-${interaction.user.username}`
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 90);

    const everyoneRole = interaction.guild.roles.everyone;
    const existingChannel = interaction.guild.channels.cache.find(
      channel => channel.name === ticketName && channel.type === ChannelType.GuildText
    );

    if (existingChannel) {
      return interaction.reply({
        content: `Hai già un ticket aperto: ${existingChannel}`,
        ephemeral: true
      });
    }

    const channel = await interaction.guild.channels.create({
      name: ticketName,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: everyoneRole.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
        }
      ]
    });

    await channel.send({ content: `🎫 Ticket creato da ${interaction.user}. Categoria: **${category.label}**` });

    return interaction.reply({
      content: `Ticket creato: ${channel}.`,
      ephemeral: true
    });
  }
};
