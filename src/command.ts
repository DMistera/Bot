
import Discord, { Message, TextChannel } from 'discord.js';

class Command {
    constructor(message : Message) {
        var line = message.content;
        var args = line.split(' ');
        this.main = args[0].slice(1, args[0].length);
        this.arguments = args.slice(1, args.length);
        this.channel = message.channel as TextChannel;
        this.author = message.author;
    }
    main : string;
    arguments : string[];
    channel : Discord.TextChannel;
    author : Discord.User;
}

export default Command;