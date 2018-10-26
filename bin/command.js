"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(message) {
        var line = message.content;
        var args = line.split(' ');
        this.main = args[0].slice(1, args[0].length);
        this.arguments = args.slice(1, args.length);
        this.channel = message.channel;
        this.author = message.author;
    }
}
exports.default = Command;
