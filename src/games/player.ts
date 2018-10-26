
import Discord from "discord.js";

class Player {
    constructor(user : Discord.User) {
        this.user = user;
        this.userID = user.id;
    }
    user : Discord.User;

    //THIS IS BECAUSE JSON.Parse() DOES NOT WORK WITH PROMISES
    userID : string;
}

export default Player;