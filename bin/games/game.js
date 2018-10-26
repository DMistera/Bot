"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Game {
    constructor(channel, endCall) {
        this.channel = channel;
        this.endCall = endCall;
    }
    //These commands should trigger only if the game is active
    readCommand(command) {
        if (command.main == "join") {
            this.addPlayer(command.author);
        }
        else if (command.main == "stop") {
            this.stop();
        }
    }
}
exports.default = Game;
