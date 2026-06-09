const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config();

const prefix = process.env.PREFIX || '!';
const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('Errore: imposta DISCORD_TOKEN nel file .env');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command && command.name) {
    client.commands.set(command.name, command);
  }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.once('ready', async () => {
  const slashCommands = client.commands
    .filter(cmd => cmd.data)
    .map(cmd => cmd.data.toJSON());

  if (slashCommands.length > 0) {
    try {
      await client.application.commands.set(slashCommands);
      console.log(`Registered ${slashCommands.length} slash command(s).`);
    } catch (error) {
      console.error('Errore registrazione slash commands:', error);
    }
  }
});

client.login(token);
