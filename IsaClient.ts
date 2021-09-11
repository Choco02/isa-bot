import { Client, Collection, Intents, PartialTypes, ClientOptions } from 'discord.js';
import { Command } from './Command';
import { Database } from 'simpl.db';

const options: ClientOptions = {
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    partials: [ 'MESSAGE', 'USER', 'CHANNEL', 'REACTION' ] as PartialTypes[]
};

export class IsaClient extends Client {
    commands: Collection<string, Command>;
    db: Database;
    
    constructor() {
        super(options);
        this.commands = new Collection();
        this.db = new Database();
    }
}
