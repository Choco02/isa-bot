/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IsaClient } from './IsaClient';
import { APIApplicationCommandOption } from 'discord-api-types';
import { Collection, CommandInteraction, GuildMember, PermissionResolvable, ApplicationCommandOptionData, ApplicationCommand } from 'discord.js';
import { promisify } from 'util';

const wait = promisify(setTimeout);

interface ISlashBuilder {
    name: string;
    description: string;
    options: APIApplicationCommandOption[];
    default_permissions?: boolean | undefined;
}

interface IOptions {
    name: string,
    description?: string;
    botPermissions?: PermissionResolvable,
    userPermissions?: PermissionResolvable,
    cooldown?: number;
    data?: ISlashBuilder;
}

interface IRetryObject {
    retries: number;
    cooldownEnds: number;
}

class Command {
    name: string;
    description: string;
    botPermissions: PermissionResolvable;
    userPermissions: PermissionResolvable;
    data: ISlashBuilder;
    cooldown: number;
    cooldownTimer: Collection<string, IRetryObject>;

    constructor({ name, description, botPermissions, userPermissions, cooldown, data }: IOptions) {
        this.name = name;
        this.description = description || 'Sem descricao disponivel';
        this.botPermissions = botPermissions || 'SEND_MESSAGES';
        this.userPermissions = userPermissions || 'SEND_MESSAGES';
        this.cooldown = cooldown as number * 1000 || 3 * 1000;
        this.data = data as ISlashBuilder;
        this.cooldownTimer = new Collection();
    }

    async check(interaction: CommandInteraction): Promise<boolean> {

        const { id } = interaction.user;
        const send = (text: string) => interaction.reply(text);
        const changePermissions = async (ativa = true) => {
            if (!interaction.client.application?.owner) await interaction.client.application?.fetch();

            const command = await interaction.guild?.commands.fetch(interaction.commandId);

            const permissions = [
                {
                    id: interaction.user.id,
                    type: 'USER',
                    permission: ativa
                }
            ];

            //@ts-ignore
            await command.permissions.add({ permissions });
        };

        let permissaoJaRemovida = false;

        try {

            const cooldownActive = this.cooldownTimer.has(id);
            
            if (cooldownActive) {

                const cooldownObj = this.cooldownTimer.get(id) as IRetryObject;

                if (cooldownObj.retries < 3) {
                    send(`Espere \`${Math.floor((cooldownObj.cooldownEnds - Date.now()) / 1000)}\`s para usar esse comando novamente`);
                    
                    (this.cooldownTimer.get(id) as IRetryObject).retries++;
                    return false;
                }
                else if (cooldownObj.retries >= 3) {

                    if (permissaoJaRemovida) return false;

                    console.log('Usuário ignorado por spammar comando');
                    await changePermissions(false);
                    permissaoJaRemovida = true;
                    return false;
                }
            }
            
            else if (!cooldownActive) {
                this.cooldownTimer.set(id, {
                    retries: 1,
                    cooldownEnds: Date.now() + this.cooldown
                });

                setTimeout(async () => {
                    this.cooldownTimer.delete(id);
                    await changePermissions();
                }, this.cooldown);
            }

            if (!(interaction.member as GuildMember)?.permissions.has(this.userPermissions)) {
                send('Voce nao tem permissao').catch(console.log);
                return false;
            }
            
            if (!(interaction.guild?.me as GuildMember).permissions.has(this.botPermissions)) {
                send(`Eu preciso das permissoes \`${this.botPermissions}\``).catch(console.log);
                return false;
            }
            
            return true;
                        
        }
        catch(err) {
            console.log(err);
            return false;
        }
    }

    execute(interaction: CommandInteraction, client: IsaClient): void {}
}

export { Command };
