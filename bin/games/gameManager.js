"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mingwieGame_1 = __importDefault(require("./bombParty/mingwieGame"));
const command_1 = __importDefault(require("../command"));
const player_1 = __importDefault(require("./player"));
const bot_1 = __importDefault(require("../bot"));
const databaseManager_1 = __importDefault(require("../databaseManager"));
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
            switch (command.main) {
                case "play":
                    if (this.activeGame == null) {
                        this.activeGame = this.mingwieGame;
                        if (!this.activeGame.start(command.arguments)) {
                            this.activeGame = null;
                        }
                    }
                    else {
                        bot_1.default.sendMessage(this.channel, `There is already an active game here!`);
                    }
                    break;
                case "top":
                    this.mingwieGame.showLeaderboard();
                    break;
                case "help":
                    bot_1.default.sendMessage(this.channel, this.helpMessage());
                    break;
                case "me":
                    var player = GameManager.findGlobalPlayer(msg.author);
                    bot_1.default.sendMessage(this.channel, this.getProfile(player));
                    break;
                case "spy":
                    if (msg.mentions.users.size > 0) {
                        var player = GameManager.findGlobalPlayer(msg.mentions.users.first());
                        bot_1.default.sendMessage(this.channel, this.getProfile(player));
                    }
                    else {
                        bot_1.default.sendMessage(this.channel, `You need to mention the victim of your vicious spying!`);
                    }
                    break;
                case "join":
                    if (this.activeGame != null) {
                        this.activeGame.addPlayer(player);
                    }
                    else {
                        bot_1.default.sendMessage(this.channel, `There are no active games in this channel. Type !play to begin one!`);
                    }
                    break;
                case "stop":
                    if (this.activeGame != null) {
                        this.activeGame.stop();
                    }
                    else {
                        bot_1.default.sendMessage(this.channel, `Baka! The game hasn't even begun and you already want to stop it!`);
                    }
                    break;
                case "give":
                    if (msg.mentions.users.size > 0) {
                        this.gift(GameManager.findGlobalPlayer(msg.author), GameManager.findGlobalPlayer(msg.mentions.users.first()), parseInt(command.arguments[1]));
                    }
                    else {
                        bot_1.default.sendMessage(this.channel, `You need to mention your receiver!`);
                    }
                    break;
                case "status":
                    if (this.activeGame != null) {
                        bot_1.default.sendMessage(this.channel, this.activeGame.getStatus());
                    }
                    else {
                        bot_1.default.sendMessage(this.channel, "There is no active game in this channel.");
                    }
                default:
                    break;
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
**!give [mention] [amount]** : give mentioned user a certain amount of Mingie Gems.
**!spy [mention]** : spy mentioned user, they may not like it.
**!status** : shows game status.
        `;
    }
    onGameEnd() {
        this.activeGame = null;
    }
    getProfile(player) {
        var rank = this.mingwieGame.getRank(player);
        var result = `${player.user} has ${player.score} Mingie Gems! (#${rank})`;
        return result;
    }
    gift(sender, receiver, amount) {
        amount = Math.floor(amount);
        if (amount > 0) {
            if (amount <= sender.score) {
                sender.score -= amount;
                receiver.score += amount;
                databaseManager_1.default.save([sender, receiver]);
                var comment = bot_1.default.randResponse([
                    `That's kind of you >.<`,
                    `What a great hero!`,
                    `Kawaii!`,
                    `Still better lovestory than twilight!`,
                    `I bet they needed that!`,
                    `Why are you not our president?`,
                    `${receiver.user} how will you respond?`
                ]);
                bot_1.default.sendMessage(this.channel, `${sender.user} was so generous he gave ${receiver.user} **${amount}** Mingie Gems! ${comment}`);
            }
            else {
                bot_1.default.sendMessage(this.channel, `You can't give something you don't have. That's not how this world works, dummy!`);
            }
        }
        else {
            bot_1.default.sendMessage(this.channel, `Give a reasonable amount!`);
        }
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
