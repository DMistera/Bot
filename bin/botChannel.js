"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameManager_1 = __importDefault(require("./games/gameManager"));
class BotChannel {
    constructor(channel) {
        this.channel = channel;
        this.gameManager = new gameManager_1.default(channel);
    }
    receiveMessage(message) {
        this.gameManager.receiveMessage(message);
    }
}
exports.default = BotChannel;
