import { Client } from "discord.js";

class ClientManager {
    static init() {
        ClientManager.client = new Client();
    }
    static client : Client;
}

export default ClientManager;