
import Discord from 'discord.js';
const client = new Discord.Client();

import Bot from './bot';
require('dotenv').config();

var bot = new Bot();

client.on('ready', () => {
    console.log("Ready!");
})

client.on('message', (msg) => {
    bot.receiveMessage(msg);
})

client.login(process.env.DISCORD_TOKEN);

