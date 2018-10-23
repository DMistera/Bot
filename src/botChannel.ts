import Discord from 'discord.js'
import Game from './game'
import Bot from './bot';

class BotChannel {
    constructor(channel : Discord.TextChannel) {
        this.channel = channel;
        this.game = new Game(channel);
    }
    game : Game;
    channel : Discord.TextChannel;
    receiveMessage(msg : Discord.Message) {
        if(msg.content.startsWith('!play')) {
            if(!this.game.active) {
                this.game.activate();
            }
            else {
                Bot.sendMessage(this.channel, "Game has been already started here!");
            }
        }
        else if(this.game.active) {
            this.game.receiveMessage(msg);
        }
    }
}

export default BotChannel;

