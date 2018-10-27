
import Discord from 'discord.js';
import ClientManager from './clientManager';
import Bot from './bot';
import fs from 'fs';
require('dotenv').config();

if(!fs.existsSync('.data')) {
    fs.mkdirSync('.data');
}

var bot = new Bot();

ClientManager.init();
ClientManager.client.on('message', (msg) => {
    bot.receiveMessage(msg);
});    
ClientManager.client.on('ready', () => {
    console.log("Ready!");
    ClientManager.client.user.setPresence({
        status: "online",
        game: {name: '!help'}
    })
    bot.init();
}); 
ClientManager.client.login(process.env.DISCORD_TOKEN);