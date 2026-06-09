const { ChannelType, PermissionsBitField } = require('discord.js');
const ticketCategories = require('../config/tickets');

const TICKET_CATEGORY_PARENT_ID = '1492537982178300084';
const RECLUTAMENTO_ROLE_ID = '1512881504236212335';
const RECLUTAMENTO_MESSAGE = `🎫 Ticket Aperto

***OOC***

**Età:
Voce Bianca:
Da quanto tempo fai RP:**

***IC***

**Nome e Cognome:
Età:
Schedamento con go pro attiva:**`;

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
      parent: TICKET_CATEGORY_PARENT_ID,
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

    const initialMessage = category.id === 'reclutamenti'
      ? `<@&${RECLUTAMENTO_ROLE_ID}>
${RECLUTAMENTO_MESSAGE}`
      : `🎫 Ticket creato da ${interaction.user}. Categoria: **${category.label}**`;

    await channel.send({
      content: initialMessage,
      allowedMentions: {
        roles: category.id === 'reclutamenti' ? [RECLUTAMENTO_ROLE_ID] : []
      }
    });

    return interaction.reply({
      content: `Ticket creato: ${channel}.`,
      ephemeral: true
    });
  }
};
