const { EmbedBuilder, ChannelType } = require('discord.js');

const LOG_CHANNELS = {
  voice: '1493011729741910127',
  channels: '1493011617925959812',
  server: '1490359297962676276',
  roles: '1493011647307059250',
  console: '1506411887515009194'
};

const CHANNEL_TYPE_NAMES = {
  [ChannelType.GuildText]: 'Testo',
  [ChannelType.GuildVoice]: 'Voce',
  [ChannelType.GuildCategory]: 'Categoria',
  [ChannelType.GuildAnnouncement]: 'Annuncio',
  [ChannelType.GuildForum]: 'Forum',
  [ChannelType.GuildStageVoice]: 'Stage',
  [ChannelType.PublicThread]: 'Thread pubblico',
  [ChannelType.PrivateThread]: 'Thread privato',
  [ChannelType.AnnouncementThread]: 'Thread annuncio',
  [ChannelType.GuildDirectory]: 'Directory'
};

function getChannelTypeName(type) {
  return CHANNEL_TYPE_NAMES[type] || String(type);
}

async function getLogChannel(client, type) {
  const channelId = LOG_CHANNELS[type];
  if (!channelId) return null;

  const cached = client.channels.cache.get(channelId);
  if (cached) return cached;

  try {
    return await client.channels.fetch(channelId);
  } catch {
    return null;
  }
}

async function sendLog(client, type, embed, content) {
  const logChannel = await getLogChannel(client, type);
  if (!logChannel) return;

  const payload = {};
  if (content) payload.content = content;
  if (embed) payload.embeds = [embed];
  if (!payload.content && !payload.embeds) return;

  await logChannel.send(payload).catch(() => {});
}

function createEmbed(title, description) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description || '\u200b')
    .setColor(0x5865F2)
    .setTimestamp();
}

function formatChannel(channel) {
  if (!channel) return 'Nessuno';
  return `${channel} (${getChannelTypeName(channel.type)})`;
}

module.exports = {
  LOG_CHANNELS,
  getLogChannel,
  sendLog,
  createEmbed,
  getChannelTypeName,
  formatChannel
};
