"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bombgame_1 = __importDefault(require("./bombParty/bombgame"));
const command_1 = __importDefault(require("../command"));
//TODO
class GameManager {
    constructor(channel) {
        this.channel = channel;
        this.bombGame = new bombgame_1.default(channel, () => {
            this.onGameEnd();
        });
    }
    receiveMessage(msg) {
        if (msg.content.startsWith('!')) {
            var command = new command_1.default(msg);
            //This is a placehorder, it should be able to deal with multiple game types
            if (command.main == "play") {
                this.activeGame = this.bombGame;
                this.activeGame.start(command.arguments);
            }
            if (command.main == "top") {
                this.bombGame.showLeaderboard();
            }
            else {
                if (this.activeGame != null) {
                    this.activeGame.readCommand(command);
                }
            }
        }
        else if (this.activeGame != null) {
            this.activeGame.receiveMessage(msg);
        }
    }
    onGameEnd() {
        this.activeGame = null;
    }
}
exports.default = GameManager;
