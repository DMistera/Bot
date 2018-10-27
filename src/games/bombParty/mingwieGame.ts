import BombPlayer from '../player';
import fs from 'fs';
import Discord, { TextChannel, User } from 'discord.js';
import Bot from '../../bot';
import Round from './round';
import Game from '../game';
import ClientManager from '../../clientManager';
import GameManager from '../gameManager';
import DatabaseManager from '../../databaseManager';

class MingwieGame extends Game {

    activePlayers : BombPlayer[];
    currentRoundNumber : number;
    currentRound : Round;
    static words : string[];
    static readonly database = '.data/mingwie.json';
    maxRounds: number = 0;
    startTimeout : NodeJS.Timeout;

    constructor(channel : Discord.TextChannel, endCall : () => any) {
        super(channel, endCall);
        this.channel = channel;
        this.currentRoundNumber = 1;
        this.activePlayers = [];
    }

    showLeaderboard() {
        GameManager.players.sort((a, b) => {
            return b.score - a.score;
        });
        var msg: string = "";
        if(GameManager.players.length < 1) {
            msg += `Nobody played this game :(`;
        }
        else {
            for(var i = 0; i < 10; i++) {
                var player = GameManager.players[i];
                if(player != null) {
                    msg += `${i + 1}. **${player.user.username}**: ${player.score} Mingie Gems.\n`;
                }
            }
        }
        Bot.sendMessage(this.channel, msg);
    }

    start(args : string[]) {
        if(args.length == 0) {
            this.maxRounds = 5;
        }
        else {
            this.maxRounds = parseInt(args[0]);
        }
        if(this.maxRounds > 0) {
            Bot.sendMessage(this.channel, `The game of ${this.maxRounds} rounds is starting in 5 seconds! Type !join at any time to join the game!`);
            this.startTimeout = setTimeout(() => {
                this.currentRound = new Round(this.channel, this.currentRoundNumber, this.activePlayers, () => {
                    this.onRoundEnd();
                });
                this.currentRound.start();
            }, 5000);
        } 
        else {
            Bot.sendMessage(this.channel, `B-baka! You can't have that many rounds!`);
        }
    }

    stop() {
        clearTimeout(this.startTimeout);
        if(this.currentRound != null) {
            this.currentRound.stop();
        }
        Bot.sendMessage(this.channel, `The game has stopped! Why would you do that? >.<`);
        this.endCall();
    }

    onRoundEnd() {
        DatabaseManager.save();
        if(this.currentRoundNumber < this.maxRounds) {
            this.currentRoundNumber++;
            this.currentRound = new Round(this.channel, this.currentRoundNumber, this.activePlayers, () => {
                this.onRoundEnd();
            });
            this.currentRound.start();
        }
        //After all rounds
        else {
            Bot.sendMessage(this.channel, `All rounds have ended. The reward system is still under development...`);
            this.endCall();
        }
    }

    receiveMessage(msg : Discord.Message) {
        if(msg.content.split(' ').length <= 1) {
            var player = this.activePlayers.find((e) => {
                return e.user.id == msg.author.id;
            });
            if(player != undefined) {
                this.currentRound.receiveMessage(msg, player);
            }
        }
    }

    static loadDictionary() {
        var content = fs.readFileSync('words.txt', 'utf8');
        this.words = content.split('\n');
    }

    addPlayer(user : Discord.User) : void {
        var player = new BombPlayer(user);
        this.activePlayers.push(player);
        Bot.sendMessage(this.channel, `${user} has joined the game!`);
    }

        
    findLocalPlayer(user : Discord.User) : BombPlayer {
        var player : BombPlayer = null;
        this.activePlayers.forEach(element => {
            if(element.user.id == user.id) {
                player = element;
            }
        });
        if(player != null) {
            return player;
        }
        else {
            var player = new BombPlayer(user);
            this.activePlayers.push(player);
            return player;
        }
    }

    static findGlobalPlayer(user : Discord.User) : BombPlayer {
        var player : BombPlayer = null;
        GameManager.players.forEach(element => {
            if(element.user.id == user.id) {
                player = element;
            }
        });
        if(player != null) {
            return player;
        }
        else {
            var player = new BombPlayer(user);
            GameManager.players.push(player);
            return player;
        }
    }
}

export default MingwieGame;