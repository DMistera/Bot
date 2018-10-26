import Discord from 'discord.js';
import BombGame from './games/bombParty/bombgame'
import BotChannel from './botChannel';

class Bot {

    constructor() {
        this.channels = [];
    }

    init() {
        BombGame.load();
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

    //Maybe some other time
    /*static loadReactions() {
        fs.readFile('reaction.js', 'utf8', (err, data) => {
            if(!err) {
                this.reactionJson = JSON.parse(data);
            }
            else {
                console.log(err);
            }
        });           
    }
    private static reactionJson : any;*/

    static randResponse(array : string[]) : string {
        var index = Math.round(array.length*Math.random() - 0.5);
        return array[index];
    }
}

export default Bot;