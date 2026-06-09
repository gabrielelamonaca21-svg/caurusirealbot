module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Bot connesso come ${client.user.tag}`);
  }
};
