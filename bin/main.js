"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clientManager_1 = __importDefault(require("./clientManager"));
const bot_1 = __importDefault(require("./bot"));
const fs_1 = __importDefault(require("fs"));
require('dotenv').config();
if (!fs_1.default.existsSync('.data')) {
    fs_1.default.mkdirSync('.data');
}
var bot = new bot_1.default();
clientManager_1.default.init();
clientManager_1.default.client.on('message', (msg) => {
    bot.receiveMessage(msg);
});
clientManager_1.default.client.on('ready', () => {
    console.log("Ready!");
    clientManager_1.default.client.user.setPresence({
        status: "online",
        game: { name: '!help' }
    });
    bot.init();
});
clientManager_1.default.client.login(process.env.DISCORD_TOKEN);
