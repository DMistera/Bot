"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bombgame_1 = __importDefault(require("./games/bombParty/bombgame"));
const botChannel_1 = __importDefault(require("./botChannel"));
class Bot {
    constructor() {
        this.channels = [];
    }
    init() {
        bombgame_1.default.load();
    }
    receiveMessage(message) {
        if (message.author.bot) {
            return;
        }
        var found = false;
        this.channels.forEach(element => {
            if (message.channel.id == element.channel.id) {
                element.receiveMessage(message);
                found = true;
            }
        });
        if (!found) {
            var channel = new botChannel_1.default(message.channel);
            this.channels.push(channel);
            channel.receiveMessage(message);
        }
    }
    static sendMessage(channel, msg) {
        channel.send(msg);
    }
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
    static randResponse(array) {
        var index = Math.round(array.length * Math.random() - 0.5);
        return array[index];
    }
}
exports.default = Bot;
