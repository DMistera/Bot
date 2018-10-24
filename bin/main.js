"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const client = new discord_js_1.default.Client();
const bot_1 = __importDefault(require("./bot"));
var bot = new bot_1.default();
client.on('ready', () => {
    console.log("Ready!");
});
client.on('message', (msg) => {
    bot.receiveMessage(msg);
});
client.login("MjcyMDgzMzc4Mjc3MTg3NTg1.Dq-5Zg.nAfAj7bRS8NNhRR-8KXeOKlcKmQ");
function keepAppUp() {
    const http = require('http');
    const express = require('express');
    const app = express();
    app.listen(8080);
    setInterval(() => {
        http.get('http://mingie-bot.glitch.me/');
    }, 8000);
}
keepAppUp();
