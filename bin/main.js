"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const client = new discord_js_1.default.Client();
const bot_1 = __importDefault(require("./bot"));
require('dotenv').config();
var bot = new bot_1.default();
client.on('ready', () => {
    console.log("Ready!");
});
client.on('message', (msg) => {
    bot.receiveMessage(msg);
});
client.login(process.env.DISCORD_TOKEN);
