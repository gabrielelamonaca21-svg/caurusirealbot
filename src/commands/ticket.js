const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const ticketCategories = require('../config/tickets');

module.exports = {
  name: 'ticket',
  description: 'Mostra il pannello di ticket con selezione categoria.',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setTitle('🎫Carusi | Tickets')
      .setDescription('**Seleziona una categoria per aprire un ticket**')
      .setImage('https://media.discordapp.net/attachments/1506064689363423416/1506064753913626694/standard_2.gif?ex=6a28971a&is=6a27459a&hm=ed700fb8d041ffb463c5f57bda4e793cc3d4a67f4992e480d9655f6740c6dbfb&=')
      .setColor(0x5865F2);

    const select = new StringSelectMenuBuilder()
      .setCustomId('ticket-category')
      .setPlaceholder('Seleziona una categoria...')
      .addOptions(ticketCategories.map(cat => ({
        label: cat.label,
        description: cat.description,
        value: cat.id,
        emoji: cat.emoji
      })));

    const row = new ActionRowBuilder().addComponents(select);

    await message.channel.send({ embeds: [embed], components: [row] });
  }
};
