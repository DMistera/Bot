"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mingwieGame_1 = __importDefault(require("./bombParty/mingwieGame"));
const command_1 = __importDefault(require("../command"));
const player_1 = __importDefault(require("./player"));
const bot_1 = __importDefault(require("../bot"));
//TODO
class GameManager {
    constructor(channel) {
        this.channel = channel;
        this.bombGame = new mingwieGame_1.default(channel, () => {
            this.onGameEnd();
        });
    }
    static init() {
        mingwieGame_1.default.loadDictionary();
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
            else if (command.main == "help") {
                bot_1.default.sendMessage(this.channel, this.helpMessage());
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
    helpMessage() {
        return `
**!help**  : displays this message
**!play [rounds]** : starts a new game with this amound of rounds
**!stop** : stops the current game
**!join** : joins the game
**!top** : shows leaderboard
        `;
    }
    onGameEnd() {
        this.activeGame = null;
    }
    static findGlobalPlayer(user) {
        var player = null;
        GameManager.players.forEach(element => {
            if (element.user.id == user.id) {
                player = element;
            }
        });
        if (player != null) {
            return player;
        }
        else {
            var player = new player_1.default(user);
            GameManager.players.push(player);
            return player;
        }
    }
}
GameManager.players = [];
exports.default = GameManager;
