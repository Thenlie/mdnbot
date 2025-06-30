import 'dotenv/config';
import { Client, GatewayIntentBits, Collection, Events, MessageFlags } from 'discord.js';
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { Logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command.default && 'execute' in command.default) {
            client.commands.set(command.default.data.name, command.default);
        } else {
            Logger.log({
                level: 'warn',
                message: `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
            });
        }
    }
}

client.on('ready', () => {
    Logger.log({
        level: 'info',
        message: `🟢 Logged in as ${client.user.tag}!`,
    });
});

// Command handling
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        Logger.log({
            level: 'error',
            message: `[commandHandler] No command matching ${interaction.commandName} was found.`,
        });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        Logger.log({
            level: 'error',
            message: `[commandHandler] ${error}`,
        });
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.deferReply({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
            await interaction.editReply(`
                There was an error while executing this command!\nFeel free to submit a bug report at https://github.com/Thenlie/mdnbot/issues.\nPath: \`${interaction.options._hoistedOptions[0].value}\`\nSection: \`${interaction.options._hoistedOptions[1].value}\`
            `);
        }
    }
});

// Autocomplete handling
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isAutocomplete()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        Logger.log({
            level: 'error',
            message: `[autocompleteHandler] No command matching ${interaction.commandName} was found.`,
        });
        return;
    }

    try {
        await command.autocomplete(interaction);
    } catch (error) {
        Logger.log({
            level: 'error',
            message: `[autocompleteHandler] ${JSON.stringify(error)}`,
        });
    }
});

client.login(process.env.TOKEN);
