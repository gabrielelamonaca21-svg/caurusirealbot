const { ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js');
const ticketCategories = require('../config/tickets');

const TICKET_CATEGORY_PARENT_ID = '1492537982178300084';
const RECLUTAMENTO_ROLE_ID = '1512881504236212335';
const BRACCIO_ROLE_IDS = ['1512898151487639785', '1512896232962654440'];
const ALLEANZA_ROLE_ID = '1492540918245490800';
const ALTO_COMANDO_ROLE_IDS = ['1512879467662676079', '1512879459244576869'];
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
  .setDescription(`*** :ticket:
Nome Gang:
Civico:
Boss:
Totale membri:
Perchè vorreste diventare nostra sotto gang:***

*__QUESTE INFORMAZIONI SONO ESCLUSIVAMENTE OOC__*`)
  .setColor(0x5865F2);

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

    const isReclutamento = category.id === 'reclutamenti';
    const isBraccio = category.id === 'braccio-armato';
    const isAlleanza = category.id === 'alleanza';
    const isAltoComando = category.id === 'alto-comando';
    const isSottoGang = category.id === 'sotto-gang';
    const messageOptions = {
      allowedMentions: {
        roles: isReclutamento ? [RECLUTAMENTO_ROLE_ID] : isBraccio ? BRACCIO_ROLE_IDS : isAlleanza ? [ALLEANZA_ROLE_ID] : isAltoComando ? ALTO_COMANDO_ROLE_IDS : []
      }
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
