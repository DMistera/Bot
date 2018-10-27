"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = __importDefault(require("../player"));
const fs_1 = __importDefault(require("fs"));
const bot_1 = __importDefault(require("../../bot"));
const round_1 = __importDefault(require("./round"));
const game_1 = __importDefault(require("../game"));
const gameManager_1 = __importDefault(require("../gameManager"));
const databaseManager_1 = __importDefault(require("../../databaseManager"));
class MingwieGame extends game_1.default {
    constructor(channel, endCall) {
        super(channel, endCall);
        this.maxRounds = 0;
        this.channel = channel;
        this.currentRoundNumber = 1;
        this.activePlayers = [];
    }
    showLeaderboard() {
        gameManager_1.default.players.sort((a, b) => {
            return a.score - b.score;
        });
        var msg = "";
        if (gameManager_1.default.players.length < 1) {
            msg += `Nobody played this game :(`;
        }
        else {
            for (var i = 0; i < 10; i++) {
                var player = gameManager_1.default.players[i];
                if (player != null) {
                    msg += `${i + 1}. ${player.user.username}: ${player.score} Mingie Gems.\n`;
                }
            }
        }
        bot_1.default.sendMessage(this.channel, msg);
    }
    start(args) {
        if (args.length == 0) {
            this.maxRounds = 5;
        }
        else {
            this.maxRounds = parseInt(args[0]);
        }
        if (this.maxRounds > 0) {
            bot_1.default.sendMessage(this.channel, `The game of ${this.maxRounds} rounds is starting in 5 seconds! Type !join at any time to join the game!`);
            this.startTimeout = setTimeout(() => {
                this.currentRound = new round_1.default(this.channel, this.currentRoundNumber, this.activePlayers, () => {
                    this.onRoundEnd();
                });
                this.currentRound.start();
            }, 5000);
        }
        else {
            bot_1.default.sendMessage(this.channel, `B-baka! You can't have that many rounds!`);
        }
    }
    stop() {
        clearTimeout(this.startTimeout);
        if (this.currentRound != null) {
            this.currentRound.stop();
        }
        bot_1.default.sendMessage(this.channel, `The game has stopped! Why would you do that? >.<`);
        this.endCall();
    }
    onRoundEnd() {
        databaseManager_1.default.save();
        if (this.currentRoundNumber < this.maxRounds) {
            this.currentRoundNumber++;
            this.currentRound = new round_1.default(this.channel, this.currentRoundNumber, this.activePlayers, () => {
                this.onRoundEnd();
            });
            this.currentRound.start();
        }
        //After all rounds
        else {
            bot_1.default.sendMessage(this.channel, `All rounds have ended. The reward system is still under development...`);
            this.endCall();
        }
    }
    receiveMessage(msg) {
        if (msg.content.split(' ').length <= 1) {
            var player = this.activePlayers.find((e) => {
                return e.user.id == msg.author.id;
            });
            if (player != undefined) {
                this.currentRound.receiveMessage(msg, player);
            }
        }
    }
    static loadDictionary() {
        var content = fs_1.default.readFileSync('words.txt', 'utf8');
        this.words = content.split('\n');
    }
    addPlayer(user) {
        var player = new player_1.default(user);
        this.activePlayers.push(player);
        bot_1.default.sendMessage(this.channel, `${user} has joined the game!`);
    }
    findLocalPlayer(user) {
        var player = null;
        this.activePlayers.forEach(element => {
            if (element.user.id == user.id) {
                player = element;
            }
        });
        if (player != null) {
            return player;
        }
        else {
            var player = new player_1.default(user);
            this.activePlayers.push(player);
            return player;
        }
    }
    static findGlobalPlayer(user) {
        var player = null;
        gameManager_1.default.players.forEach(element => {
            if (element.user.id == user.id) {
                player = element;
            }
        });
        if (player != null) {
            return player;
        }
        else {
            var player = new player_1.default(user);
            gameManager_1.default.players.push(player);
            return player;
        }
    }
}
MingwieGame.database = '.data/mingwie.json';
exports.default = MingwieGame;
