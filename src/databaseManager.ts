
import PG from 'pg';
import Player from './games/player';
import ClientManager from './clientManager';
import GameManager from './games/gameManager';

class DatabaseManager {
    static readonly playerTableName = "players";
    static client : PG.Client;
    static init() {
        this.client = new PG.Client({
            ssl: true,
            connectionString: process.env.DATABASE_URL
        });
        this.client.connect().then(() => {
            this.client.query(
                `
                CREATE TABLE IF NOT EXISTS ${this.playerTableName} (
                    userid char(255),
                    score int
                );
                `, (err) => {
                    if(err) {
                        console.error(err);
                    }
                    else {
                        GameManager.players = this.loadPlayers();
                    }
            });
        });
    }
    static loadPlayers() : Player[] {
        var result : Player[] = [];
        this.client.query(`
            SELECT * FROM players;
        `, (err, res) => {
            if(err) {
                console.error(err);
            }
            else {
                for (var row of res.rows) {
                    var id : string = row.userid;
                    ClientManager.client.fetchUser(id.trim()).then((u) => {
                        var player = new Player(u);
                        player.score = row.score;
                        result.push(player);
                    })
                }
            }
        })
        return result;
    }
    static save() {
        var players = GameManager.players;
        var s = "";
        players.forEach((e) => {
            s += `('${e.user.id}',${e.score}),`
        })
        s = s.slice(0, -1);
        var query = `
        INSERT INTO ${this.playerTableName} (userid, score)
        VALUES ${s};
        `;
        console.log(query);
        this.client.query(query, (err, res) => {
            if(err) {
                console.error(err);
            }
        })
    }
}

export default DatabaseManager;