"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const player_1 = __importDefault(require("./games/player"));
const clientManager_1 = __importDefault(require("./clientManager"));
const gameManager_1 = __importDefault(require("./games/gameManager"));
class DatabaseManager {
    static init() {
        this.client = new pg_1.default.Client({
            ssl: true,
            connectionString: process.env.DATABASE_URL
        });
        this.client.connect().then(() => {
            this.client.query(`
                CREATE TABLE IF NOT EXISTS ${this.playerTableName} (
                    userid char(255),
                    score int
                );
                `, (err) => {
                if (err) {
                    console.error(err);
                }
                else {
                    gameManager_1.default.players = this.loadPlayers();
                }
            });
        });
    }
    static loadPlayers() {
        var result = [];
        this.client.query(`
            SELECT * FROM players;
        `, (err, res) => {
            if (err) {
                console.error(err);
            }
            else {
                for (var row of res.rows) {
                    var id = row.userid;
                    clientManager_1.default.client.fetchUser(id.trim()).then((u) => {
                        var player = new player_1.default(u);
                        player.score = row.score;
                        result.push(player);
                    });
                }
            }
        });
        return result;
    }
    static save() {
        this.client.query(`TRUNCATE players;`, (err) => {
            if (err) {
                console.error(err);
            }
            else {
                var players = gameManager_1.default.players;
                var s = "";
                players.forEach((e) => {
                    s += `('${e.user.id}',${e.score}),`;
                });
                s = s.slice(0, -1);
                var query = `
                INSERT INTO ${this.playerTableName} (userid, score)
                VALUES ${s};
                `;
                console.log(query);
                this.client.query(query, (err, res) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });
    }
}
DatabaseManager.playerTableName = "players";
exports.default = DatabaseManager;
