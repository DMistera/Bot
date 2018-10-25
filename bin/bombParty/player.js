"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(u) {
        this.user = u;
        this.score = 0;
        this.longest = "";
    }
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
}
exports.default = Player;
