"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = __importDefault(require("./bombParty/game"));
const bot_1 = __importDefault(require("./bot"));
class BotChannel {
    constructor(channel) {
        this.channel = channel;
        this.game = null;
    }
    receiveMessage(msg) {
        if (msg.content.startsWith('!play')) {
            if (this.game == null) {
                this.game = new game_1.default(this.channel, () => {
                    this.game = null;
                });
                this.game.activate();
            }
            else {
                bot_1.default.sendMessage(this.channel, "Game has been already started here!");
            }
        }
        else if (msg.content.startsWith(`!stop`)) {
            if (this.game != null) {
                this.game.stop();
            }
        }
        else if (this.game != null) {
            this.game.receiveMessage(msg);
        }
    }
}
exports.default = BotChannel;
