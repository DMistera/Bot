"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = __importDefault(require("./bombParty/game"));
const bot_1 = __importDefault(require("./bot"));
const command_1 = __importDefault(require("./command"));
class BotChannel {
    constructor(channel) {
        this.channel = channel;
        this.game = null;
    }
    receiveMessage(msg) {
        if (msg.content.startsWith('!')) {
            var command = new command_1.default(msg.content);
            if (command.main == "play") {
                if (this.game == null) {
                    var roundCount = 0;
                    if (command.arguments.length == 0) {
                        roundCount = 5;
                    }
                    else {
                        roundCount = parseInt(command.arguments[0]);
                    }
                    if (roundCount > 0) {
                        this.game = new game_1.default(this.channel, roundCount, () => {
                            this.game = null;
                        });
                        this.game.activate();
                    }
                    else {
                        bot_1.default.sendMessage(this.channel, `B-baka! You can't have that many rounds!`);
                    }
                }
                else {
                    bot_1.default.sendMessage(this.channel, "Game has been already started here!");
                }
            }
            else if (command.main == "join") {
                if (this.game != null) {
                    this.game.addPlayer(msg.author);
                }
            }
            else if (command.main == "stop") {
                if (this.game != null) {
                    this.game.stop();
                }
            }
        }
        else if (this.game != null) {
            this.game.receiveMessage(msg);
        }
    }
}
exports.default = BotChannel;
