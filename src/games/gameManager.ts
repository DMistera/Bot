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
        this.mingwieGame = new MingwieGame(channel, () => {
            this.onGameEnd();
        })
    }
    static init() {
        MingwieGame.loadDictionary();
    }
    channel : TextChannel;
    mingwieGame : MingwieGame;
    activeGame : Game;
    static players: Player[] = [];
    receiveMessage(msg : Discord.Message) {
        if(msg.content.startsWith('!')) {
            var command = new Command(msg);
            var player = GameManager.findGlobalPlayer(msg.author);
            //This is a placehorder, it should be able to deal with multiple game types
            if(command.main == "play") {
                if(this.activeGame == null) {
                    this.activeGame = this.mingwieGame;
                    this.activeGame.start(command.arguments);
                }
                else {
                    Bot.sendMessage(this.channel, `There is already an active game here!`);
                }
            }
            if(command.main == "top") {
                this.mingwieGame.showLeaderboard();
            }
            else if(command.main == "help") {
                Bot.sendMessage(this.channel, this.helpMessage());
            }
            else if(command.main == "me") {
                var player = GameManager.findGlobalPlayer(msg.author);
                Bot.sendMessage(this.channel, this.getProfile(player));
            }
            else if(command.main == "join") {
                if(this.activeGame != null) {
                    this.activeGame.addPlayer(player);
                }
                else {
                    Bot.sendMessage(this.channel, `There are no active games in this channel. Type !play to begin one!`);
                }
            }
            else if(command.main == "stop") {
                if(this.activeGame != null) {
                    this.activeGame.stop();
                }
                else {
                    Bot.sendMessage(this.channel, `Baka! The game hasn't even begun and you already want to stop it!`);
                }
            }
        }
        else if(this.activeGame != null) {
            this.activeGame.receiveMessage(msg);
        }
    }

    static sortPlayers() {
        GameManager.players.sort((a, b) => {
            return b.score - a.score;
        });
    }

    helpMessage() : string {
        return `
**!help**  : displays this message
**!play [rounds]** : starts a new game with this amount of rounds
**!stop** : stops the current game
**!join** : joins the game
**!top** : shows leaderboard
**!me** : shows your score
        `;
    }

    onGameEnd() {
        this.activeGame = null;
    }

    getProfile(player : Player) : string {
        var rank = this.mingwieGame.getRank(player);
        var result = `${player.user} You have ${player.score} Mingie Gems! (#${rank})`;
        return result;
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