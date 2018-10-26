import BombPlayer from './bombplayer';
import fs from 'fs';
import Discord, { TextChannel, User } from 'discord.js';
import Bot from '../../bot';
import Round from './round';
import Game from '../game';
import ClientManager from '../../clientManager';

class BombGame extends Game {

    activePlayers : BombPlayer[];
    currentRoundNumber : number;
    currentRound : Round;
    static words : string[];
    static players: BombPlayer[] = [];
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
        BombGame.players.sort((a, b) => {
            return a.score - b.score;
        });
        var msg: string = "";
        if(BombGame.players.length < 1) {
            msg += `Nobody played this game :(`;
        }
        else {
            for(var i = 0; i < 10; i++) {
                var player = BombGame.players[i];
                if(player != null) {
                    msg += `${i + 1}. ${player.user.username}: ${player.score} Mingie Gems.\n`;
                }
            }
        }
        Bot.sendMessage(this.channel, msg);
    }

    save() {
        var data = JSON.stringify(BombGame.players, (key, value) => {
            if(key == "user") {
                return;
            }
            else {
                return value;
            }
        });
        fs.writeFile(BombGame.database, data, (err) => {
            if(err) {
                console.error(err);
            }
        });
    }

    static async load() {
        BombGame.loadDictionary();
        if(!fs.existsSync(BombGame.database)) {
            console.log(`Save file doesnt exist!`);
            BombGame.players = [];
        }
        else { 
            await fs.readFile(BombGame.database, "utf8", (err, data) => {
                if(!err) {
                    BombGame.players = JSON.parse(data) as BombPlayer[];
                    BombGame.players.forEach((p) => {
                        ClientManager.client.fetchUser(p.userID).then((u) => {
                            p.user = u;
                        }).catch((err) => {
                            console.error(err)
                        });
                    });
                }
                else {
                    console.error(err);
                }
            });
        }
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
        this.save();
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
        BombGame.players.forEach(element => {
            if(element.user.id == user.id) {
                player = element;
            }
        });
        if(player != null) {
            return player;
        }
        else {
            var player = new BombPlayer(user);
            BombGame.players.push(player);
            return player;
        }
    }
}

export default BombGame;