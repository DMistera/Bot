import Discord from 'discord.js';
import Game from './bombParty/game'
import BotChannel from './botChannel';

class Bot {

    constructor() {
        Game.loadDictionary();
        this.channels = [];
        console.log("Bot has been initialized!");
    }

    public receiveMessage(message : Discord.Message) {
        if(message.author.bot) {
            return;
        }
        var found : boolean = false;
        this.channels.forEach(element => {
            if(message.channel.id == element.channel.id) {
                element.receiveMessage(message);
                found = true;
            }
        });
        if(!found) {
            var channel = new BotChannel(message.channel as Discord.TextChannel);
            this.channels.push(channel);
            channel.receiveMessage(message);
        }
    }

    static sendMessage(channel : Discord.TextChannel, msg : string) {
        channel.send(msg);
    }

    //Each game for each text channel
    channels : BotChannel[];


    static randResponse(array : string[]) : string {
        var index = Math.round(array.length*Math.random() - 0.5);
        return array[index];
    }
}

export default Bot;