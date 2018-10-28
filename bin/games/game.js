"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("../bot"));
const gameManager_1 = __importDefault(require("./gameManager"));
class Game {
    constructor(channel, endCall) {
        this.channel = channel;
        this.endCall = endCall;
    }
    showLeaderboard() {
        this.sort();
        var msg = "";
        if (gameManager_1.default.players.length < 1) {
            msg += `Nobody played this game :(`;
        }
        else {
            for (var i = 0; i < 10; i++) {
                var player = gameManager_1.default.players[i];
                if (player != null) {
                    msg += `${i + 1}. **${player.user.tag}**: ${player.score} Mingie Gems.\n`;
                }
            }
        }
        bot_1.default.sendMessage(this.channel, msg);
    }
    getRank(player) {
        this.sort();
        var i = 1;
        for (var p of gameManager_1.default.players) {
            if (player.user.id == p.user.id) {
                break;
            }
            i++;
        }
        return i;
    }
    sort() {
        gameManager_1.default.players.sort((a, b) => {
            return this.sortComparator(a, b);
        });
    }
    addPlayer(player) {
        var add = true;
        this.activePlayers.forEach((e) => {
            if (e.user.id == player.user.id) {
                add = false;
            }
        });
        if (add) {
            this.activePlayers.push(player);
            bot_1.default.sendMessage(this.channel, `${player.user} has joined the game!`);
        }
        else {
            bot_1.default.sendMessage(this.channel, `${player.user}, you are already in this game!`);
        }
    }
}
exports.default = Game;
