import Player from './player';
import Discord, { TextChannel } from 'discord.js';
import Command from '../command';

abstract class Game {
    constructor(channel : Discord.TextChannel, endCall : () => any) {
        this.channel = channel;
        this.endCall = endCall;
    }

    //These commands should trigger only if the game is active
    readCommand(command : Command) {
        if(command.main == "join") {
            this.addPlayer(command.author);
        }
        else if(command.main == "stop") {
            this.stop();
        }
    }
    abstract receiveMessage(message : Discord.Message);
    abstract start(args : string[]);
    abstract addPlayer(user : Discord.User) : void;
    abstract stop();
    abstract showLeaderboard();
    endCall : () => any;
    activePlayers : Player[];
    channel : Discord.TextChannel;
}

export default Game;