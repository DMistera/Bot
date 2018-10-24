import Discord from 'discord.js'
import Game from './bombParty/game'
import Bot from './bot';
import Command from './command';

class BotChannel {
    constructor(channel : Discord.TextChannel) {
        this.channel = channel;
        this.game = null;
    }
    game : Game;
    channel : Discord.TextChannel;
    receiveMessage(msg : Discord.Message) {
        if(msg.content.startsWith('!')) {
            var command = new Command(msg.content);
            if(command.main == "play") {
                if(this.game == null) {
                    var roundCount = 0;
                    if(command.arguments.length == 0) {
                        roundCount = 5;
                    }
                    else {
                        roundCount = parseInt(command.arguments[0]);
                    }
                    if(roundCount > 0) {
                        this.game = new Game(this.channel, parseInt(command.arguments[0]), () => {
                            this.game = null;
                        });
                        this.game.activate();
                    }
                    else {
                        Bot.sendMessage(this.channel, `B-baka! You can't have that many rounds!`);
                    }
                }
                else {
                    Bot.sendMessage(this.channel, "Game has been already started here!");
                }
            }
            else if(command.main == "stop") {
                if(this.game != null) {
                    this.game.stop();
                }
            }
        }
        else if(this.game != null) {
            this.game.receiveMessage(msg);
        }
    }
}

export default BotChannel;

