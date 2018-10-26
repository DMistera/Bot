"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ClientManager {
    static init() {
        ClientManager.client = new discord_js_1.Client();
    }
}
exports.default = ClientManager;
