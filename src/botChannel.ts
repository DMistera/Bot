import Discord from 'discord.js'
import Game from './bombParty/game'
import Bot from './bot';

class BotChannel {
    constructor(channel : Discord.TextChannel) {
        this.channel = channel;
        this.game = null;
    }
    game : Game;
    channel : Discord.TextChannel;
    receiveMessage(msg : Discord.Message) {
        if(msg.content.startsWith('!play')) {
            if(this.game == null) {
                this.game = new Game(this.channel, () => {
                    this.game = null;
                });
                this.game.activate();
            }
            else {
                Bot.sendMessage(this.channel, "Game has been already started here!");
            }
        }
        else if(msg.content.startsWith(`!stop`)) {
            if(this.game != null) {
                this.game.stop();
            }
        }
        else if(this.game != null) {
            this.game.receiveMessage(msg);
        }
    }
}

export default BotChannel;

