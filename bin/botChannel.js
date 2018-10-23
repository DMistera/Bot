"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = __importDefault(require("./game"));
const bot_1 = __importDefault(require("./bot"));
class BotChannel {
    constructor(channel) {
        this.channel = channel;
        this.game = new game_1.default(channel);
    }
    receiveMessage(msg) {
        if (msg.content.startsWith('!play')) {
            if (!this.game.active) {
                this.game.activate();
            }
            else {
                bot_1.default.sendMessage(this.channel, "Game has been already started here!");
            }
        }
        else if (this.game.active) {
            this.game.receiveMessage(msg);
        }
    }
}
exports.default = BotChannel;
