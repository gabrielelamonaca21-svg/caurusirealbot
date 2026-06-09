module.exports = {
  name: 'messageCreate',
  execute(message) {
    if (message.author.bot || !message.guild) return;

    const prefix = process.env.PREFIX || '!';
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();
    const command = message.client.commands.get(commandName);

    if (!command) return;

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('Errore durante l\'esecuzione del comando.');
    }
  }
};
