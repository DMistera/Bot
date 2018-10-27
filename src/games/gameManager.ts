import MingwieGame from "./bombParty/mingwieGame";
import Discord, { TextChannel } from 'discord.js';
import Command from "../command";
import Game from "./game";
import Player from "./player";
import Bot from "../bot";

//TODO

class GameManager {
    constructor(channel : TextChannel) {
        this.channel = channel;
        this.bombGame = new MingwieGame(channel, () => {
            this.onGameEnd();
        })
    }
    static init() {
        MingwieGame.loadDictionary();
    }
    channel : TextChannel;
    bombGame : MingwieGame;
    activeGame : Game;
    static players: Player[] = [];
    receiveMessage(msg : Discord.Message) {
        if(msg.content.startsWith('!')) {
            var command = new Command(msg);

            //This is a placehorder, it should be able to deal with multiple game types
            if(command.main == "play") {
                if(this.activeGame == null) {
                    this.activeGame = this.bombGame;
                    this.activeGame.start(command.arguments);
                }
                else {
                    Bot.sendMessage(this.channel, `There is already an active game here!`);
                }
            }
            if(command.main == "top") {
                this.bombGame.showLeaderboard();
            }
            else if(command.main == "help") {
                Bot.sendMessage(this.channel, this.helpMessage());
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

    helpMessage() : string {
        return `
**!help**  : displays this message
**!play [rounds]** : starts a new game with this amount of rounds
**!stop** : stops the current game
**!join** : joins the game
**!top** : shows leaderboard
        `;
    }

    onGameEnd() {
        this.activeGame = null;
    }

    static findGlobalPlayer(user : Discord.User) : Player {
        var player : Player = null;
        GameManager.players.forEach(element => {
            if(element.user.id == user.id) {
                player = element;
            }
        });
        if(player != null) {
            return player;
        }
        else {
            var player = new Player(user);
            GameManager.players.push(player);
            return player;
        }
    }
}

export default GameManager;