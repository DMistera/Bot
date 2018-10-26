
import Discord from 'discord.js';
import Player from '../player';

class BombPlayer extends Player{
    constructor(u : Discord.User) {
        super(u);
        this.score = 0;
        this.longest = "";
    }
    score : number;
    longest: string;
    time : number;
    updateLongest(answer : string) : boolean {
        if(answer.length > this.longest.length) {
            this.longest = answer;
            this.time = Date.now();
            return true;
        }
        return false;
    }
    reset() {
        this.longest = "";
        this.score = 0;
    }
}

export default BombPlayer;