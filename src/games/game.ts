import Player from './player';
import Discord, { TextChannel } from 'discord.js';
import Command from '../command';
import Bot from '../bot';
import GameManager from './gameManager';

abstract class Game {
    constructor(channel : Discord.TextChannel, endCall : () => any) {
        this.channel = channel;
        this.endCall = endCall;
    }

    abstract receiveMessage(message : Discord.Message);
    abstract start(args : string[]) : boolean;
    abstract stop();
    abstract sortComparator(a : Player, b : Player) : number;
    abstract getStatus() : string;

    showLeaderboard() {
        this.sort();
        var msg: string = "";
        if(GameManager.players.length < 1) {
            msg += `Nobody played this game :(`;
        }
        else {
            for(var i = 0; i < 10; i++) {
                var player = GameManager.players[i];
                if(player != null) {
                    msg += `${i + 1}. **${player.user.tag}**: ${player.score} Mingie Gems.\n`;
                }
            }
        }
        Bot.sendMessage(this.channel, msg);
    }

    getRank(player : Player) {
        this.sort();
        var i = 1;
        for(var p of GameManager.players) {
            if(player.user.id == p.user.id) {
                break;
            }
            i++;
        }
        return i;
    }

    sort() {
        GameManager.players.sort((a, b) => {
            return this.sortComparator(a, b);
        })
    }


    addPlayer(player : Player) {
        var add = true;
        this.activePlayers.forEach((e) => {
            if(e.user.id == player.user.id) {
                add = false;
            }
        })
        if(add) {
            this.activePlayers.push(player);
            Bot.sendMessage(this.channel, `${player.user} has joined the game!`);
        }
        else {
            Bot.sendMessage(this.channel, `${player.user}, you are already in this game!`);
        }
    }

    endCall : () => any;
    activePlayers : Player[];
    channel : Discord.TextChannel;
}

export default Game;