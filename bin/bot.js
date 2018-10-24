"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = __importDefault(require("./bombParty/game"));
const botChannel_1 = __importDefault(require("./botChannel"));
class Bot {
    constructor() {
        game_1.default.loadDictionary();
        this.channels = [];
        console.log("Bot has been initialized!");
    }
    receiveMessage(message) {
        if (message.author.bot) {
            return;
        }
        var found = false;
        this.channels.forEach(element => {
            if (message.channel.id == element.channel.id) {
                element.receiveMessage(message);
                found = true;
            }
        });
        if (!found) {
            var channel = new botChannel_1.default(message.channel);
            this.channels.push(channel);
            channel.receiveMessage(message);
        }
    }
    static sendMessage(channel, msg) {
        channel.send(msg);
    }
    static randResponse(array) {
        var index = Math.round(array.length * Math.random() - 0.5);
        return array[index];
    }
}
exports.default = Bot;
