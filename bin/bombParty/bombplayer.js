"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = __importDefault(require("../player"));
class BombPlayer extends player_1.default {
    constructor(u) {
        super(u);
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
exports.default = BombPlayer;
