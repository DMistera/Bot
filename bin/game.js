"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = __importDefault(require("./player"));
const fs_1 = __importDefault(require("fs"));
const bot_1 = __importDefault(require("./bot"));
class Game {
    constructor(channel) {
        //Const
        this.gameTime = 15;
        this.longest = "";
        this.sequence = "";
        this.rounds = 0;
        this.channel = channel;
        this.active = false;
        this.activePlayers = [];
    }
    static loadDictionary() {
        var content = fs_1.default.readFileSync('words.txt', 'utf8');
        this.words = content.split('\r\n');
    }
    activate() {
        this.active = true;
        this.generateSequence();
        this.findLongest();
        bot_1.default.sendMessage(this.channel, `The game has been started! Find a word containting the sequence **${this.sequence.toUpperCase()}**. The longest word has ${this.longest.length} letters! You have ${this.gameTime} seconds!`);
        setTimeout(() => {
            var winner = null;
            var bestTime = Number.MAX_SAFE_INTEGER;
            var message = `The game has ended! The longest word was ${this.longest}! Here are the results: \n`;
            var scorePool = 0;
            var bestWord = "";
            this.activePlayers.forEach((e) => {
                if (e.longest.length > bestWord.length) {
                    bestWord = e.longest;
                    bestTime = e.time;
                    winner = e;
                }
                else if (e.longest.length == bestWord.length && e.time < bestTime) {
                    bestWord = e.longest;
                    bestTime = e.time;
                    winner = e;
                }
                var score = this.scoreAnswer(e.longest);
                scorePool += score;
                message += `${e.user.username} answered ${e.longest} (${e.longest.length} letters) and earned ${score} Mingie Points!\n`;
            });
            if (winner == null) {
                message += `Nobody got a single score :(`;
            }
            else {
                var globalPlayer = Game.findGlobalPlayer(winner.user);
                message += `The winner is ${winner.user.username} earning a total of ${scorePool} Mingie Points!\n`;
                globalPlayer.score += scorePool;
            }
            this.activePlayers = [];
            bot_1.default.sendMessage(this.channel, message);
            this.longest = "";
            this.active = false;
        }, this.gameTime * 1000);
    }
    generateSequence() {
        var index = Math.round(Math.random() * Game.words.length);
        var word = Game.words[index];
        var rstart = Math.round(Math.random() * (word.length - 3));
        this.sequence = word.substr(rstart, 3);
    }
    findLongest() {
        Game.words.forEach((e) => {
            if (e.length > this.longest.length && e.includes(this.sequence)) {
                this.longest = e;
            }
        });
    }
    receiveMessage(message) {
        var result = this.validateAnswer(message.content);
        var msg = `${message.author} `;
        if (result == AnswerResults.CORRECT) {
            var player = this.findLocalPlayer(message.author);
            if (player.updateLongest(message.content)) {
                var score = this.scoreAnswer(message.content);
                var reaction = bot_1.default.randResponse([
                    "Nyaaa-haha, nice answer!",
                    "N-N-NANI?",
                    "Is this the true power of ultra instinct?",
                    "You are too good!",
                    "Wow 727!",
                    "Blaze that!",
                    "Are you insane?",
                    "Ayaya!",
                    "Mother of god!",
                    "Greetings!",
                    "Are you cheating?",
                    "Do you like my face? No..? Same...",
                    "Time to go.. even further.. beyond!",
                    "/me dabs!",
                    `Wheeeeeeee`,
                    `Eat me!`,
                    `Nya!`,
                    `Cookiezi would be proud of you`,
                    `Sometimes I wish I was a cat... A black cat... Anyways,`,
                    `Let the games begin!`,
                    `Hot shot!`,
                    `Your path of an exile has begun!`,
                    `Jackpot!`,
                    `♂ Take ♂ it ♂ boy ♂`
                ]);
                msg += `${reaction} Your answer was worth ${score} Mingie Points!`;
            }
            else {
                msg += "Good answer, but your last one was better.";
            }
        }
        else if (result == AnswerResults.ERR_NOT_IN_DICT) {
            var respone = bot_1.default.randResponse([
                "Learn dictionary, dumbass!",
                "Dumbass! This isn't even a word!",
                `Wh.. What? Where have you ever heard of such a word as ${message.content}`,
                `${message.content} is the same as your purpose. It doesnt exist.`,
                `Pfft, put your ${message.content} down deep in your`,
                `Nice name for a company. Unfortunately not so good for this game!`,
                `Hi, my name is ${message.content}, can you find a real word?`,
                `I cry when ${message.content} deserve to die!`,
                `${message.content} is an illusion!`,
                `Why are you so in love with ${message.content}?`
            ]);
            msg += `${respone}`;
        }
        else if (result == AnswerResults.ERR_COPYING) {
            msg += bot_1.default.randResponse([
                "You dummy! Don't copy other's answers!",
                "What a copy-pasta, nyan!"
            ]);
        }
        else {
            var respone = bot_1.default.randResponse([
                `Hey! You were supposed to include the sequence, dummy!`,
                `Hey dummy! Can't you even check the letters`,
                `Maybe you should go back to school and learn to include 3-letter sequences in your words!`
            ]);
            msg += respone;
        }
        bot_1.default.sendMessage(this.channel, msg);
    }
    validateAnswer(answer) {
        var rawAnswer = answer.trim().toLowerCase();
        if (!rawAnswer.includes(this.sequence)) {
            return AnswerResults.ERR_DSNT_CONTAIN;
        }
        var copying = false;
        this.activePlayers.forEach((e) => {
            if (e.longest === answer) {
                copying = true;
                return;
            }
        });
        if (copying) {
            return AnswerResults.ERR_COPYING;
        }
        var inDict = false;
        Game.words.forEach((e) => {
            for (var i = 0; i < rawAnswer.length; i++) {
                if (rawAnswer == e) {
                    inDict = true;
                    break;
                }
            }
        });
        if (inDict) {
            return AnswerResults.CORRECT;
        }
        else {
            return AnswerResults.ERR_NOT_IN_DICT;
        }
    }
    scoreAnswer(answer) {
        var difference = this.longest.length - answer.length;
        var threshold = 15;
        var base = answer.length;
        if (difference > threshold) {
            return base;
        }
        else {
            return base * Math.pow(2, threshold - difference);
        }
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
var AnswerResults;
(function (AnswerResults) {
    AnswerResults[AnswerResults["ERR_NOT_IN_DICT"] = 0] = "ERR_NOT_IN_DICT";
    AnswerResults[AnswerResults["ERR_DSNT_CONTAIN"] = 1] = "ERR_DSNT_CONTAIN";
    AnswerResults[AnswerResults["ERR_COPYING"] = 2] = "ERR_COPYING";
    AnswerResults[AnswerResults["CORRECT"] = 3] = "CORRECT";
})(AnswerResults || (AnswerResults = {}));
exports.default = Game;
