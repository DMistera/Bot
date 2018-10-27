
import Discord from "discord.js";

class Player {
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
    constructor(user : Discord.User) {
        this.user = user;
        this.score = 0;
        this.longest = "";
    }
    user : Discord.User;
}

export default Player;