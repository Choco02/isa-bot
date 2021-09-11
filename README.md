# Um bot feito em TypeScript em fase de desenvolvimento ✨

* Bot simples com handler de comandos apenas para **slash commands**, com cooldown que remove permissão de slash

### Como rodar o projeto

* Tenha o Node v16 e Discord.js v13 instalado
* Baixe o projeto
* Rode o seguinte comando `npm i`

Coloque suas credenciais de acesso ao bot num arquivo `config.ts` no seguinte formato

```ts
const config = {
    token: 'seu token',
    CLIENT_ID: 'client id do seu bot',
    GUILD_ID: 'id do server usado para desenvolvimento de comandos'
};

export { config };

```

Rode o projeto para desenvolvimento com `npm run dev` e faça a build com `npm run build`

*Happy hacking*✨
