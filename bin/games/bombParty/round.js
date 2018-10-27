"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("../../bot"));
const mingwieGame_1 = __importDefault(require("./mingwieGame"));
const gameManager_1 = __importDefault(require("../gameManager"));
class Round {
    constructor(channel, number, players, endCall) {
        //Const
        this.gameTime = 15;
        this.sequence = "";
        this.longest = "";
        this.channel = channel;
        this.number = number;
        this.endCall = endCall;
        this.roundEndTimeout = null;
        this.activePlayers = [];
    }
    start() {
        this.generateSequence();
        this.findLongest();
        bot_1.default.sendMessage(this.channel, `Round ${this.number} has been started! Find a word containting the sequence **${this.sequence.toUpperCase()}**. The longest word has **${this.longest.length}** letters! You have ${this.gameTime} seconds!`);
        this.roundEndTimeout = setTimeout(() => {
            this.onRoundEnd();
        }, this.gameTime * 1000);
    }
    onRoundEnd() {
        var bestTime = Number.MAX_SAFE_INTEGER;
        var message = `The round has ended! The longest word was **${this.longest}**! Here are the results: \n`;
        var scorePool = 0;
        var bestWord = "";
        this.activePlayers.forEach((e) => {
            if (e.longest.length > bestWord.length) {
                bestWord = e.longest;
                bestTime = e.time;
                this.winner = e;
            }
            else if (e.longest.length == bestWord.length && e.time < bestTime) {
                bestWord = e.longest;
                bestTime = e.time;
                this.winner = e;
            }
            var score = this.scoreAnswer(e.longest);
            scorePool += score;
            if (score > 0) {
                message += `**${e.user.username}** answered ${e.longest} (${e.longest.length} letters) and earned ${score} Mingie Gems!\n`;
            }
            e.reset();
        });
        if (this.winner == null) {
            message += `Nobody got a single score :(`;
        }
        else {
            var globalPlayer = gameManager_1.default.findGlobalPlayer(this.winner.user);
            message += `The winner of this round is **${this.winner.user.username}** earning a total of ${scorePool} Mingie Gems!\n`;
            globalPlayer.score += scorePool;
            //console.log(globalPlayer.);
        }
        bot_1.default.sendMessage(this.channel, message);
        this.endCall();
    }
    stop() {
        clearTimeout(this.roundEndTimeout);
    }
    receiveMessage(message, player) {
        var result = this.validateAnswer(message.content);
        var msg = `${message.author} `;
        //Add player if he's not there
        var p = this.activePlayers.find((e) => {
            return e.user.id == player.user.id;
        });
        if (p == undefined) {
            this.activePlayers.push(player);
        }
        if (result == AnswerResults.CORRECT) {
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
                    `Wheeeeeeee!`,
                    `Eat me!`,
                    `Nya!`,
                    `Sometimes I wish I was a cat... A black cat... Anyways,`,
                    `Let the games begin!`,
                    `Hot shot!`,
                    `Your path of an exile has begun!`,
                    `Jackpot!`,
                    `♂ Take ♂ it ♂ boy ♂`,
                    `Amazing!`,
                    `${message.content} is my life now!`,
                    `You can see red sirens in the distance...`,
                    `You have unlocked a special achievment... Just kidding!`,
                    `Guys! We got a millionaire!`,
                    `Unstopable force meets unmovable object!`,
                    `It's dangerous to go alone!`,
                    `Eleven stars!`,
                    `C-C-C-COMBO BREAKER!`,
                    `I see what you did here...`,
                    `It is our inspiration that defines us!`,
                    `The quick brown fox jumps over the lazy dog!`,
                    `DVD Logo just hit the corner!`,
                    `Tetris!`,
                    `K.O.!`,
                    `Taste the Rainbow!`,
                    `Don't let your dreams be dreams!`,
                    `What's the worst that could happen?`,
                    `Yay! You did it! You finally did it!`
                ]);
                msg += `${reaction} Your answer was worth **${score}** Mingie Gems!`;
            }
            else {
                msg += bot_1.default.randResponse([
                    "Good answer, but your last one was better.",
                    "You can do better!"
                ]);
            }
        }
        else if (result == AnswerResults.ERR_NOT_IN_DICT) {
            var respone = bot_1.default.randResponse([
                "Learn dictionary, dumbass!",
                "Dumbass! This isn't even a word!",
                `Wh.. What? Where have you ever heard of such a word as ${message.content}`,
                `${message.content} is the same as your purpose. It doesnt exist.`,
                `Nice name for a company. Unfortunately not so good for this game!`,
                `Hi, my name is ${message.content}, can you find a real word?`,
                `I cry when ${message.content} deserve to die!`,
                `${message.content} is an illusion!`,
                `Why are you so in love with ${message.content}?`,
                `This would be a good pick up line: Would you like to see my ${message.content}, babe?`,
                `Baka! Baka! Baka! Where do you find such words?`,
                `If you like ${message.content} so much why don't you include it in your CV?`,
                `${message.content} was my teacher's name, not a word.`,
                `You found an easter egg! Just kidding, you don't even know the dictionary!`,
                `"${message.content}.", ${message.author.username} 2018. Truly meaningful!`,
                `Step 1. ${message.content}, Step 2. ??? Step3. Profit.`,
                `${message.content} is truly undesirable`,
                `There exists a village named ${message.content}`
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
                `Maybe you should go back to school and learn to include 3-letter sequences in your words!`,
                `Baka! You had one job! Include the magical sequence!`
            ]);
            msg += respone;
        }
        bot_1.default.sendMessage(this.channel, msg);
    }
    generateSequence() {
        var index = Math.round(Math.random() * mingwieGame_1.default.words.length);
        var word = mingwieGame_1.default.words[index];
        if (word.length < 4) {
            this.generateSequence();
            return;
        }
        var rstart = Math.round(Math.random() * (word.length - 4));
        this.sequence = word.substr(rstart, 3);
    }
    findLongest() {
        mingwieGame_1.default.words.forEach((e) => {
            if (e.length > this.longest.length && e.includes(this.sequence)) {
                this.longest = e;
            }
        });
    }
    validateAnswer(answer) {
        var rawAnswer = answer.trim().toLowerCase();
        if (!rawAnswer.includes(this.sequence)) {
            return AnswerResults.ERR_DSNT_CONTAIN;
        }
        var copying = false;
        this.activePlayers.forEach((e) => {
            if (e.longest.toLowerCase() === answer.toLowerCase()) {
                copying = true;
                return;
            }
        });
        if (copying) {
            return AnswerResults.ERR_COPYING;
        }
        var inDict = false;
        mingwieGame_1.default.words.forEach((e) => {
            if (rawAnswer === e.trim()) {
                inDict = true;
                return;
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
        var difference = 1 - (this.longest.length - answer.length) / this.longest.length;
        var power = 1 + difference;
        return Math.floor(Math.pow(answer.length, power));
    }
}
var AnswerResults;
(function (AnswerResults) {
    AnswerResults[AnswerResults["ERR_NOT_IN_DICT"] = 0] = "ERR_NOT_IN_DICT";
    AnswerResults[AnswerResults["ERR_DSNT_CONTAIN"] = 1] = "ERR_DSNT_CONTAIN";
    AnswerResults[AnswerResults["ERR_COPYING"] = 2] = "ERR_COPYING";
    AnswerResults[AnswerResults["CORRECT"] = 3] = "CORRECT";
})(AnswerResults || (AnswerResults = {}));
exports.default = Round;
