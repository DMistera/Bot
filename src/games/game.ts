import Player from './player';
import Discord, { TextChannel } from 'discord.js';
import Command from '../command';
import Bot from '../bot';

abstract class Game {
    constructor(channel : Discord.TextChannel, endCall : () => any) {
        this.channel = channel;
        this.endCall = endCall;
    }

    abstract receiveMessage(message : Discord.Message);
    abstract start(args : string[]);
    abstract stop();
    abstract showLeaderboard();


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