import Player from '../player';
import fs from 'fs';
import Discord, { TextChannel, User } from 'discord.js';
import Bot from '../../bot';
import Round from './round';
import Game from '../game';
import ClientManager from '../../clientManager';
import GameManager from '../gameManager';
import DatabaseManager from '../../databaseManager';

class MingwieGame extends Game {

    activePlayers : Player[];
    currentRoundNumber : number;
    currentRound : Round;
    static words : string[];
    static readonly database = '.data/mingwie.json';
    maxRounds: number = 0;
    startTimeout : NodeJS.Timeout;

    constructor(channel : Discord.TextChannel, endCall : () => any) {
        super(channel, endCall);
        this.channel = channel;
    }

        
    sortComparator(a: Player, b: Player): number {
        return b.score - a.score;
    }

    start(args : string[]) : boolean {
        this.currentRoundNumber = 1;
        this.activePlayers = [];
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
            return true;
        } 
        else {
            Bot.sendMessage(this.channel, `B-baka! You can't have that many rounds!`);
            return false;
        }
    }

    stop() {
        clearTimeout(this.startTimeout);
        if(this.currentRound != null) {
            this.currentRound.stop();
        }
        var response = Bot.randResponse([
            `The game has stopped! Why would you do that? >.<`,
            `B-B-But are you sure? .. ok fine. The game is gone! All thanks to you!`,
            `Wheee, what a party killer. Did you really have to?`,
            `It was so fun but you had to ruin everything!`
        ])
        Bot.sendMessage(this.channel, response);
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
            Bot.sendMessage(this.channel, `All rounds have ended!`);
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
    
}

export default MingwieGame;