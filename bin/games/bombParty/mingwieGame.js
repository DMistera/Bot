"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const bot_1 = __importDefault(require("../../bot"));
const round_1 = __importDefault(require("./round"));
const game_1 = __importDefault(require("../game"));
const databaseManager_1 = __importDefault(require("../../databaseManager"));
class MingwieGame extends game_1.default {
    constructor(channel, endCall) {
        super(channel, endCall);
        this.maxRounds = 0;
        this.channel = channel;
    }
    sortComparator(a, b) {
        return b.score - a.score;
    }
    start(args) {
        this.currentRoundNumber = 1;
        this.activePlayers = [];
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
            return true;
        }
        else {
            bot_1.default.sendMessage(this.channel, `B-baka! You can't have that many rounds!`);
            return false;
        }
    }
    stop() {
        clearTimeout(this.startTimeout);
        if (this.currentRound != null) {
            this.currentRound.stop();
        }
        var response = bot_1.default.randResponse([
            `The game has stopped! Why would you do that? >.<`,
            `B-B-But are you sure? .. ok fine. The game is gone! All thanks to you!`,
            `Wheee, what a party killer. Did you really have to?`,
            `It was so fun but you had to ruin everything!`
        ]);
        bot_1.default.sendMessage(this.channel, response);
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
            bot_1.default.sendMessage(this.channel, `All rounds have ended!`);
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
}
MingwieGame.database = '.data/mingwie.json';
exports.default = MingwieGame;
