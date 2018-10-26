import BombGame from "./bombParty/bombgame";
import Discord, { TextChannel } from 'discord.js';
import Command from "../command";
import Bot from "../bot";
import Game from "./game";

//TODO

class GameManager {
    constructor(channel : TextChannel) {
        this.channel = channel;
        this.bombGame = new BombGame(channel, () => {
            this.onGameEnd();
        })
    }
    channel : TextChannel;
    bombGame : BombGame;
    activeGame : Game;
    receiveMessage(msg : Discord.Message) {
        if(msg.content.startsWith('!')) {
            var command = new Command(msg);

            //This is a placehorder, it should be able to deal with multiple game types
            if(command.main == "play") {
                this.activeGame = this.bombGame;
                this.activeGame.start(command.arguments);
            }
            if(command.main == "top") {
                this.bombGame.showLeaderboard();
            }
            else {
                if(this.activeGame != null) {
                    this.activeGame.readCommand(command);
                }
            }
        }
        else if(this.activeGame != null) {
            this.activeGame.receiveMessage(msg);
        }
    }

    onGameEnd() {
        this.activeGame = null;
    }
}

export default GameManager;