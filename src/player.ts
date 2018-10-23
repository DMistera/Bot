
import Discord from 'discord.js';

class Player {
    constructor(u : Discord.User) {
        this.user = u;
        this.score = 0;
        this.longest = "";
    }
    user: Discord.User;
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
}

export default Player;