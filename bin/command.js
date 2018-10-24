"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(line) {
        var args = line.split(' ');
        this.main = args[0].slice(1, args[0].length);
        this.arguments = args.slice(1, args.length);
    }
}
exports.default = Command;
