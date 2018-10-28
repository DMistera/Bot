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
                    userid char(255) UNIQUE,
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
                for (let row of res.rows) {
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
    static save(players) {
        var values = "";
        players.forEach((e) => {
            values += `('${e.user.id}',${e.score}),`;
        });
        values = values.slice(0, -1);
        var query = `
            INSERT INTO players (userid, score)
            VALUES ${values}
            ON CONFLICT (userid) DO UPDATE
                SET score = excluded.score;
        `;
        console.log(query);
        this.client.query(query, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
}
DatabaseManager.playerTableName = "players";
exports.default = DatabaseManager;
