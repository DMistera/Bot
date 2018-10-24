"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = __importDefault(require("./player"));
const fs_1 = __importDefault(require("fs"));
const bot_1 = __importDefault(require("../bot"));
const round_1 = __importDefault(require("./round"));
class BombGame {
    constructor(channel, roundCount, endCall) {
        this.maxRounds = 0;
        this.channel = channel;
        this.maxRounds = roundCount;
        this.currentRoundNumber = 1;
        this.endCall = endCall;
        this.activePlayers = [];
    }
    activate() {
        bot_1.default.sendMessage(this.channel, `The game of ${this.maxRounds} rounds is starting in 5 seconds! Type !join at any time to join the game!`);
        this.startTimeout = setTimeout(() => {
            this.currentRound = new round_1.default(this.channel, this.currentRoundNumber, this.activePlayers, () => {
                this.onRoundEnd();
            });
            this.currentRound.activate();
        }, 5000);
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
        if (this.currentRoundNumber < this.maxRounds) {
            this.currentRoundNumber++;
            this.currentRound = new round_1.default(this.channel, this.currentRoundNumber, this.activePlayers, () => {
                this.onRoundEnd();
            });
            this.currentRound.activate();
        }
        //After all rounds
        else {
            bot_1.default.sendMessage(this.channel, `All rounds have ended. The reward system is still under development...`);
            this.endCall();
        }
    }
    receiveMessage(msg) {
        var player = this.activePlayers.find((e) => {
            return e.user.id == msg.author.id;
        });
        if (player != undefined) {
            this.currentRound.receiveMessage(msg, player);
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
        BombGame.players.forEach(element => {
            if (element.user.id == user.id) {
                player = element;
            }
        });
        if (player != null) {
            return player;
        }
        else {
            var player = new player_1.default(user);
            BombGame.players.push(player);
            return player;
        }
    }
}
BombGame.players = [];
exports.default = BombGame;
