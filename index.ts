import { IsaClient } from './IsaClient';
import { config } from './config';
import { readdirSync } from 'fs';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Command } from './Command';

const { token, CLIENT_ID, GUILD_ID } = config;

const commandsFolder = './commands';
const commands: unknown[] = [];

const client = new IsaClient();

const loadCommands = async () => {

    const files = readdirSync(commandsFolder);
    for (const file of files) {
        const { command }: { command: Command } = await import(`${commandsFolder}/${file}`);
        client.commands.set(command.name, command);
        commands.push(command.data);
        console.log(`${command.name} carregado`);
    }
};

const rest = new REST({ version: '9' }).setToken(token);

const registerSlash = async () => {
    try { 
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');

    }
    catch(err) {
        console.error(err);
    }
};

client.once('ready', async () => {
    await loadCommands();
    await registerSlash();
    console.log(`${client.user?.username} online`);
});

client.on('interactionCreate', async interaction => {

    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName) as Command;

    command && await command.check(interaction) && command.execute(interaction, client);
    
});

client.login(token);
