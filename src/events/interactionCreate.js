const { ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, AttachmentBuilder } = require('discord.js');
const ticketCategories = require('../config/tickets');

const TICKET_CATEGORY_PARENT_ID = '1492537982178300084';
const RECLUTAMENTO_ROLE_ID = '1512881504236212335';
const BRACCIO_ROLE_IDS = ['1512898151487639785', '1512896232962654440'];
const ALLEANZA_ROLE_ID = '1492540918245490800';
const ALTO_COMANDO_ROLE_IDS = ['1512879467662676079', '1512879459244576869'];
const SOTTO_GANG_ROLE_ID = '1512882453990084778';
const TRANSCRIPT_CHANNEL_ID = '1463080891411730648';
const RECLUTAMENTO_EMBED = new EmbedBuilder()
  .setTitle('🎫 Ticket Aperto')
  .setDescription(`***OOC***

***Età:***
***Voce Bianca:***
***Da quanto tempo fai RP:***

***IC***

***Nome e Cognome:***
***Età:***
***Schedamento con go pro attiva:***`)
  .setColor(0x5865F2);
const BRACCIO_EMBED = new EmbedBuilder()
  .setTitle('🎫 Ticket Aperto')
  .setDescription(`***OOC***

***Età:***
***Voce Bianca:***
***Da quanto tempo fai RP:***
***Clip/montage NO PVP NO ROLAS:***

***IC***

***Nome e Cognome:***
***Età:***
***Schedamento con go pro attiva:***
***Che ruolo vorresti avere (braccio leggeri/braccio pesanti):***`)
  .setColor(0x5865F2);
const ALLEANZA_EMBED = new EmbedBuilder()
  .setTitle('🎫 Ticket Aperto')
  .setDescription(`***OOC***

***Nome fazione:***
***Civico:***
***Sottogang attuali:***
***Boss:***
***Perchè vorreste allearvi a noi:***

__*QUESTE INFORMAZIONI SONO ESCLUSIVAMENTE OOC*__`)
  .setColor(0x5865F2);
const ALTO_COMANDO_EMBED = new EmbedBuilder()
  .setTitle('🎫 Ticket Aperto')
  .setDescription(`***__Esponi la tua richiesta/problema ad un <@&1512879467662676079>/ <@&1512879459244576869>__***`)
  .setColor(0x5865F2);
const SOTTO_GANG_EMBED = new EmbedBuilder()
  .setTitle('🎫 Ticket Aperto')
  .setDescription(`**Nome Gang:**
**Civico:**
**Boss:**
**Totale membri:**
**Perchè vorreste diventare nostra sotto gang:**

*__QUESTE INFORMAZIONI SONO ESCLUSIVAMENTE OOC__*`)
  .setColor(0x5865F2);
module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'Errore durante l\'esecuzione del comando.', ephemeral: true });
        } else {
          await interaction.reply({ content: 'Errore durante l\'esecuzione del comando.', ephemeral: true });
        }
      }
      return;
    }

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

      if (!interaction.channel || !interaction.guild) {
        return interaction.reply({ content: 'Impossibile chiudere il ticket in questo canale.', ephemeral: true });
      }

      const channel = interaction.channel;
      const createdAt = channel.createdAt ? channel.createdAt.toLocaleString('it-IT', { timeZone: 'Europe/Rome' }) : 'N/D';
      const closedAt = new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' });

      const transcriptMessages = await channel.messages.fetch({ limit: 100 });
      const sortedMessages = Array.from(transcriptMessages.values()).sort((a, b) => a.createdTimestamp - b.createdTimestamp);
      const transcriptBody = sortedMessages.map(msg => {
        const author = `${msg.author.tag}`;
        const time = msg.createdAt.toLocaleString('it-IT', { timeZone: 'Europe/Rome' });
        const content = msg.content || '';
        const attachments = msg.attachments.size > 0 ? ` [ALLEGATI: ${msg.attachments.map(att => att.url).join(', ')}]` : '';
        return `[${time}] ${author}: ${content}${attachments}`;
      }).join('\n');

      const transcriptText = `Ticket: ${channel.name}\nCanale: ${channel.id}\nAperto da: ${interaction.user.tag}\nMotivo chiusura: ${label}\nApertura: ${createdAt}\nChiusura: ${closedAt}\n\n--- Transcript ---\n${transcriptBody}`;
      const transcriptBuffer = Buffer.from(transcriptText, 'utf-8');
      const transcriptFileName = `${channel.name}-transcript.txt`;
      const transcriptAttachment = new AttachmentBuilder(transcriptBuffer, { name: transcriptFileName });

      const closedEmbed = new EmbedBuilder()
        .setTitle('🔒 Ticket Chiuso')
        .addFields(
          { name: 'Canale', value: `${channel}`, inline: false },
          { name: 'Aperto da', value: `${interaction.user}`, inline: true },
          { name: 'Chiuso da', value: `${interaction.user}`, inline: true },
          { name: 'Motivazione', value: label, inline: true },
          { name: 'Apertura', value: createdAt, inline: true },
          { name: 'Chiusura', value: closedAt, inline: true }
        )
        .setColor(0xED4245);

      // Disable the close button in any existing bot message
      try {
        const fetched = await channel.messages.fetch({ limit: 50 });
        const botMsg = fetched.find(m => m.author.id === interaction.client.user.id && m.components.length > 0);
        if (botMsg) {
          await botMsg.edit({ components: [] });
        }
      } catch (e) {}

      const transcriptArchiveChannel = interaction.guild.channels.cache.get(TRANSCRIPT_CHANNEL_ID);
      const archiveEmbed = closedEmbed;
      archiveEmbed.data.fields = archiveEmbed.data.fields.map(field =>
        field.name === 'Canale' ? { ...field, value: `#${channel.name}` } : field
      );

      let transcriptUrl;
      if (transcriptArchiveChannel) {
        const tempFileMessage = await transcriptArchiveChannel.send({ files: [transcriptAttachment] });
        transcriptUrl = tempFileMessage.attachments.first()?.url;
        await tempFileMessage.delete().catch(() => {});

        if (transcriptUrl) {
          const downloadRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Scarica Transcript').setStyle(ButtonStyle.Link).setURL(transcriptUrl)
          );
          await transcriptArchiveChannel.send({ embeds: [archiveEmbed], components: [downloadRow] });
        } else {
          await transcriptArchiveChannel.send({ embeds: [archiveEmbed] });
        }
      } else {
        await channel.send({ embeds: [archiveEmbed], files: [transcriptAttachment] });
      }

      await interaction.reply({ content: `Ticket chiuso: **${label}**`, ephemeral: true });
      try {
        await channel.delete('Ticket chiuso');
      } catch (e) {
        console.error('Impossibile eliminare il canale ticket:', e);
      }
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
