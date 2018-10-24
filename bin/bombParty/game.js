"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = __importDefault(require("./player"));
const fs_1 = __importDefault(require("fs"));
const bot_1 = __importDefault(require("../bot"));
const round_1 = __importDefault(require("./round"));
class Game {
    constructor(channel, endCall) {
        this.maxRounds = 0;
        this.channel = channel;
        this.maxRounds = 5;
        this.currentRoundNumber = 1;
        this.endCall = endCall;
    }
    activate() {
        this.currentRound = new round_1.default(this.channel, this.currentRoundNumber, () => {
            this.onRoundEnd();
        });
        this.currentRound.activate();
    }
    stop() {
        this.currentRound.stop();
        bot_1.default.sendMessage(this.channel, `The game has stopped! Why would you do that? >.<`);
        this.endCall();
    }
    onRoundEnd() {
        if (this.currentRoundNumber <= this.maxRounds) {
            this.currentRound = new round_1.default(this.channel, this.currentRoundNumber, () => {
                this.onRoundEnd();
            });
            this.currentRound.activate();
            this.currentRoundNumber++;
        }
        //After all rounds
        else {
            bot_1.default.sendMessage(this.channel, `All rounds have ended. The reward system is still under development...`);
            this.endCall();
        }
    }
    receiveMessage(msg) {
        this.currentRound.receiveMessage(msg);
    }
    static loadDictionary() {
        var content = fs_1.default.readFileSync('words.txt', 'utf8');
        this.words = content.split('\n');
    }
    static findGlobalPlayer(user) {
        var player = null;
        Game.players.forEach(element => {
            if (element.user.id == user.id) {
                player = element;
            }
        });
        if (player != null) {
            return player;
        }
        else {
            var player = new player_1.default(user);
            Game.players.push(player);
            return player;
        }
    }
}
Game.players = [];
exports.default = Game;
