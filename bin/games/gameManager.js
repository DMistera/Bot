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
        this.mingwieGame = new mingwieGame_1.default(channel, () => {
            this.onGameEnd();
        });
    }
    static init() {
        mingwieGame_1.default.loadDictionary();
    }
    receiveMessage(msg) {
        if (msg.content.startsWith('!')) {
            var command = new command_1.default(msg);
            var player = GameManager.findGlobalPlayer(msg.author);
            //This is a placehorder, it should be able to deal with multiple game types
            if (command.main == "play") {
                if (this.activeGame == null) {
                    this.activeGame = this.mingwieGame;
                    this.activeGame.start(command.arguments);
                }
                else {
                    bot_1.default.sendMessage(this.channel, `There is already an active game here!`);
                }
            }
            if (command.main == "top") {
                this.mingwieGame.showLeaderboard();
            }
            else if (command.main == "help") {
                bot_1.default.sendMessage(this.channel, this.helpMessage());
            }
            else if (command.main == "me") {
                var player = GameManager.findGlobalPlayer(msg.author);
                bot_1.default.sendMessage(this.channel, this.getProfile(player));
            }
            else if (command.main == "join") {
                if (this.activeGame != null) {
                    this.activeGame.addPlayer(player);
                }
                else {
                    bot_1.default.sendMessage(this.channel, `There are no active games in this channel. Type !play to begin one!`);
                }
            }
            else if (command.main == "stop") {
                if (this.activeGame != null) {
                    this.activeGame.stop();
                }
                else {
                    bot_1.default.sendMessage(this.channel, `Baka! The game hasn't even begun and you already want to stop it!`);
                }
            }
        }
        else if (this.activeGame != null) {
            this.activeGame.receiveMessage(msg);
        }
    }
    static sortPlayers() {
        GameManager.players.sort((a, b) => {
            return b.score - a.score;
        });
    }
    helpMessage() {
        return `
**!help**  : displays this message
**!play [rounds]** : starts a new game with this amount of rounds
**!stop** : stops the current game
**!join** : joins the game
**!top** : shows leaderboard
**!me** : shows your score
        `;
    }
    onGameEnd() {
        this.activeGame = null;
    }
    getProfile(player) {
        var rank = this.mingwieGame.getRank(player);
        var result = `${player.user} You have ${player.score} Mingie Gems! (#${rank})`;
        return result;
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
