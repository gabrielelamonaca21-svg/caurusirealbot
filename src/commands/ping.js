module.exports = {
  name: 'ping',
  description: 'Risponde con Pong e la latenza.',
  execute(message, args) {
    const latency = Date.now() - message.createdTimestamp;
    return message.reply(`Pong! Latency: ${latency}ms`);
  }
};
