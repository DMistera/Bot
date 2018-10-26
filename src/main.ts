
import Discord from 'discord.js';
import ClientManager from './clientManager';
import Bot from './bot';
require('dotenv').config();

var bot = new Bot();

ClientManager.init();
ClientManager.client.on('message', (msg) => {
    bot.receiveMessage(msg);
});    
ClientManager.client.on('ready', () => {
    console.log("Ready!");
    bot.init();
}); 
ClientManager.client.login(process.env.DISCORD_TOKEN);