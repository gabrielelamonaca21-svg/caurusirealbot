const { ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const ticketCategories = require('../config/tickets');

const TICKET_CATEGORY_PARENT_ID = '1492537982178300084';
const RECLUTAMENTO_ROLE_ID = '1512881504236212335';
const BRACCIO_ROLE_IDS = ['1512898151487639785', '1512896232962654440'];
const ALLEANZA_ROLE_ID = '1492540918245490800';
const ALTO_COMANDO_ROLE_IDS = ['1512879467662676079', '1512879459244576869'];
module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // Handle close button click: show select menu with reasons
    if (interaction.isButton() && interaction.customId === 'close-ticket') {
      const closeMenu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('ticket-close-reason')
          .setPlaceholder('Seleziona motivo di chiusura')
          .addOptions(
            { label: 'Risolto', value: 'risolto', description: 'Il problema è stato risolto' },
            { label: 'Inattività', value: 'inattivita', description: 'Chiudo per inattività' },
            { label: 'Reclutato', value: 'reclutato', description: 'Utente reclutato' }
          )
      );

      return interaction.reply({ content: 'Seleziona il motivo di chiusura:', components: [closeMenu], ephemeral: true });
    }

    // Handle the close reason selection
    if (interaction.isStringSelectMenu() && interaction.customId === 'ticket-close-reason') {
      const value = interaction.values[0];
      const map = { risolto: 'Risolto', inattivita: 'Inattività', reclutato: 'Reclutato' };
      const label = map[value] || value;

      // Announce in channel
      if (interaction.channel) {
        await interaction.channel.send({ content: `**Ticket chiuso**\n**Motivo:** **${label}**\nChiuso da: ${interaction.user}` });

        // Remove/disable close button from bot message if present
        try {
          const fetched = await interaction.channel.messages.fetch({ limit: 50 });
          const botMsg = fetched.find(m => m.author.id === interaction.client.user.id && m.components.length > 0);
          if (botMsg) {
            await botMsg.edit({ components: [] });
          }
        } catch (e) {}

        // Optionally prevent the ticket author from sending further messages
        try {
          const ticketAuthor = interaction.channel.permissionOverwrites.cache.find(po => po.type === 'member' && po.allow?.has?.(PermissionsBitField.Flags.ViewChannel));
          // Remove send permission for the user who clicked close (best-effort)
          await interaction.channel.permissionOverwrites.edit(interaction.user.id, { SendMessages: false }).catch(() => {});
        } catch (e) {}
      }

      await interaction.reply({ content: `Ticket chiuso: **${label}**`, ephemeral: true });
      return;
    }

    // Handle ticket creation select menu
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

    const isReclutamento = category.id === 'reclutamenti';
    const isBraccio = category.id === 'braccio-armato';
    const isAlleanza = category.id === 'alleanza';
    const isAltoComando = category.id === 'alto-comando';
    const isSottoGang = category.id === 'sotto-gang';

    const channelOverwrites = [
      {
        id: everyoneRole.id,
        deny: [PermissionsBitField.Flags.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
      }
    ];

    // ALLEANZA role should be able to view most tickets, but not alto-comando or sotto-gang
    if (!isAltoComando && !isSottoGang) {
      channelOverwrites.push({
        id: ALLEANZA_ROLE_ID,
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory]
      });
    }

    // For sotto-gang tickets, only the specific sotto-gang role (plus the author) can view
    if (isSottoGang) {
      channelOverwrites.push({
        id: SOTTO_GANG_ROLE_ID,
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory]
      });
    }

    if (isBraccio) {
      channelOverwrites.push(
        {
          id: BRACCIO_ROLE_IDS[0],
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory]
        },
        {
          id: BRACCIO_ROLE_IDS[1],
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory]
        }
      );
    }

    if (isAltoComando) {
      channelOverwrites.push(
        {
          id: ALTO_COMANDO_ROLE_IDS[0],
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory]
        },
        {
          id: ALTO_COMANDO_ROLE_IDS[1],
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory]
        }
      );
    }

    const channel = await interaction.guild.channels.create({
      name: ticketName,
      type: ChannelType.GuildText,
      parent: TICKET_CATEGORY_PARENT_ID,
      permissionOverwrites: channelOverwrites
    });

    const closeButtonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('close-ticket').setLabel('Chiudi Ticket').setStyle(ButtonStyle.Danger)
    );

    const messageOptions = {
      allowedMentions: {
        roles: isReclutamento ? [RECLUTAMENTO_ROLE_ID] : isBraccio ? BRACCIO_ROLE_IDS : isAlleanza ? [ALLEANZA_ROLE_ID] : isAltoComando ? ALTO_COMANDO_ROLE_IDS : isSottoGang ? [SOTTO_GANG_ROLE_ID] : []
      },
      components: [closeButtonRow]
    };

    if (isReclutamento) {
      messageOptions.content = `<@&${RECLUTAMENTO_ROLE_ID}>`;
      messageOptions.embeds = [RECLUTAMENTO_EMBED];
    } else if (isBraccio) {
      messageOptions.content = `<@&${BRACCIO_ROLE_IDS[0]}> <@&${BRACCIO_ROLE_IDS[1]}>`;
      messageOptions.embeds = [BRACCIO_EMBED];
    } else if (isAlleanza) {
      messageOptions.content = `<@&${ALLEANZA_ROLE_ID}>`;
      messageOptions.embeds = [ALLEANZA_EMBED];
    } else if (isAltoComando) {
      messageOptions.content = `<@&${ALTO_COMANDO_ROLE_IDS[0]}> <@&${ALTO_COMANDO_ROLE_IDS[1]}>`;
      messageOptions.embeds = [ALTO_COMANDO_EMBED];
    } else if (isSottoGang) {
      messageOptions.content = `<@&${SOTTO_GANG_ROLE_ID}>`;
      messageOptions.embeds = [SOTTO_GANG_EMBED];
    } else {
      messageOptions.content = `🎫 Ticket creato da ${interaction.user}. Categoria: **${category.label}**`;
    }

    await channel.send(messageOptions);

    return interaction.reply({
      content: `Ticket creato: ${channel}.`,
      ephemeral: true
    });
  }
};
