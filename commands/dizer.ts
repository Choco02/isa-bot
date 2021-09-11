import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from '../Command';

class Dizer extends Command {
    execute(interaction: CommandInteraction) {
        const content = interaction.options.getString('mensagem');
        interaction.reply({ content });
    }
}
const [ name, description ] = [ 'dizer', 'Peça para o bot repetir alguma coisa' ];


const command = new Dizer({ 
    name,
    description,
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption(option => 
            option.setName('mensagem')
                .setDescription('A mensagem a ser falada')
                .setRequired(true)
        )
        .toJSON()
});

export { command };
