"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    updateLongest(answer) {
        if (answer.length > this.longest.length) {
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
    constructor(user) {
        this.user = user;
        this.score = 0;
        this.longest = "";
    }
}
exports.default = Player;
