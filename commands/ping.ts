import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from '../Command';
import { IsaClient } from '../IsaClient';

class Ping extends Command {
    execute(interaction: CommandInteraction, client: IsaClient) {
        interaction.reply(`Meu ping: ${client.ws.ping}`);
    }
}

const [ name, description ] = [ 'ping', 'Ping do cliente' ];

const command = new Ping({
    name,
    description,
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .toJSON()
});

export { command };
