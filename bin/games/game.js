"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("../bot"));
class Game {
    constructor(channel, endCall) {
        this.channel = channel;
        this.endCall = endCall;
    }
    addPlayer(player) {
        var add = true;
        this.activePlayers.forEach((e) => {
            if (e.user.id == player.user.id) {
                add = false;
            }
        });
        if (add) {
            this.activePlayers.push(player);
            bot_1.default.sendMessage(this.channel, `${player.user} has joined the game!`);
        }
        else {
            bot_1.default.sendMessage(this.channel, `${player.user}, you are already in this game!`);
        }
    }
}
exports.default = Game;
