import Discord from 'discord.js'
import GameManager from './games/gameManager';

class BotChannel {
    constructor(channel : Discord.TextChannel) {
        this.channel = channel;
        this.gameManager = new GameManager(channel);
    }
    receiveMessage(message : Discord.Message) {
        this.gameManager.receiveMessage(message);
    }
    gameManager : GameManager;
    channel : Discord.TextChannel;
}

export default BotChannel;

