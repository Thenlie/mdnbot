import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { Logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(filePath);
        if ('data' in command.default && 'execute' in command.default) {
            commands.push(command.default.data.toJSON());
        } else {
            Logger.log({
                level: 'info',
                message: `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
            });
        }
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    Logger.log({
        level: 'info',
        message: 'Successfully reloaded application (/) commands.',
    });
} catch (error) {
    Logger.log({
        level: 'error',
        message: error,
    });
}
