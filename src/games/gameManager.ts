import MingwieGame from "./bombParty/mingwieGame";
import Discord, { TextChannel } from 'discord.js';
import Command from "../command";
import Game from "./game";
import Player from "./player";
import Bot from "../bot";
import ClientManager from '../clientManager'
import DatabaseManager from "../databaseManager";

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
            switch(command.main) {
                case "play":
                    if(this.activeGame == null) {
                        this.activeGame = this.mingwieGame;
                        if(!this.activeGame.start(command.arguments)) {
                            this.activeGame = null;
                        }
                    }
                    else {
                        Bot.sendMessage(this.channel, `There is already an active game here!`);
                    }
                    break;
                case "top":
                    this.mingwieGame.showLeaderboard();
                    break;
                case "help":
                    Bot.sendMessage(this.channel, this.helpMessage());
                    break;
                case "me":
                    var player = GameManager.findGlobalPlayer(msg.author);
                    Bot.sendMessage(this.channel, this.getProfile(player));
                    break;
                case "join":
                    if(this.activeGame != null) {
                        this.activeGame.addPlayer(player);
                    }
                    else {
                        Bot.sendMessage(this.channel, `There are no active games in this channel. Type !play to begin one!`);
                    }
                    break;
                case "stop":
                    if(this.activeGame != null) {
                        this.activeGame.stop();
                    }
                    else {
                        Bot.sendMessage(this.channel, `Baka! The game hasn't even begun and you already want to stop it!`);
                    }
                    break;
                case "give" :
                    if(msg.mentions.users.size > 0) {
                        this.gift(GameManager.findGlobalPlayer(msg.author), GameManager.findGlobalPlayer(msg.mentions.users.first()), parseInt(command.arguments[1]));
                    }
                    else {
                        Bot.sendMessage(this.channel, `You need to mention your receiver!`);
                    }
                    break;
                default:
                    break;
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

    gift(sender : Player, receiver : Player, amount : number) {
        if(amount > 0) {
            if(amount <= sender.score) {
                sender.score -= amount;
                receiver.score += amount;
                DatabaseManager.save();
                var comment = Bot.randResponse([
                    `That's kind of you >.<`,
                    `What a great hero!`,
                    `Kawaii!`,
                    `Still better lovestory than twilight!`,
                    `I bet they needed that!`,
                    `Why are you not our president?`,
                    `${receiver.user} how will you respond?`
                ])
                Bot.sendMessage(this.channel, `${sender.user} was so generous he gave ${receiver.user} **${amount}** Mingie Gems! ${comment}`);
            }
            else {
                Bot.sendMessage(this.channel, `You can't give something you don't have. That's not how this world works, dummy!`);
            }
        }
        else {
            Bot.sendMessage(this.channel, `Give a reasonable amount!`);
        }
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