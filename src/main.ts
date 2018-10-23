
import Discord from 'discord.js';
const client = new Discord.Client();

import Bot from './bot';

var bot = new Bot();

client.on('ready', () => {
    console.log("Ready!");
})

client.on('message', (msg) => {
    bot.receiveMessage(msg);
})

client.login("MjcyMDgzMzc4Mjc3MTg3NTg1.Dq-5Zg.nAfAj7bRS8NNhRR-8KXeOKlcKmQ");

function keepAppUp() {
    const http = require('http');
    const express = require('express');
    const app = express();
    app.listen(8080);
    setInterval(() => {
        http.get('http://exile-discord.glitch.me/');
    }, 8000);
}