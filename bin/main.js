"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clientManager_1 = __importDefault(require("./clientManager"));
const bot_1 = __importDefault(require("./bot"));
require('dotenv').config();
var bot = new bot_1.default();
clientManager_1.default.init();
clientManager_1.default.client.on('message', (msg) => {
    bot.receiveMessage(msg);
});
clientManager_1.default.client.on('ready', () => {
    console.log("Ready!");
    bot.init();
});
clientManager_1.default.client.login(process.env.DISCORD_TOKEN);
