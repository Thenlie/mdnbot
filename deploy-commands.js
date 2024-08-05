import 'dotenv/config'
import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = await import(filePath);
		if ('data' in command.default && 'execute' in command.default) {
			commands.push(command.default.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// const commands = [
//   {
//     name: 'ping',
//     description: 'Replies with Pong!',
//   },
//   {
//     name: 'mdn',
//     description: 'Query the MDN Web Docs',
//     type: 1,
//     options: [
//       {
//         name: 'language',
//         description: 'HTML, CSS or JavaScript',
//         type: 3,
//         required: true,
//         choices: [
//           {
//             name: 'JavaScript',
//             value: 'javascript'
//           },
//           {
//             name: 'HTML',
//             value: 'html'
//           },
//           {
//             name: 'CSS',
//             value: 'css'
//           },
//         ]
//       },
//       {
//         name: 'query',
//         description: 'query to search in MDN',
//         type: 3,
//         required: true
//       },
//     ]
//   },
//   {
//     name: 'javascript',
//     description: 'Search the MDN JavaScript documentation',
//     type: 1,
//     options: [
//       {
//         name: 'query',
//         description: 'JavaScript reference to search for',
//         type: 3,
//         required: true,
//         autocomplete: true
        
//       }
//     ]
//   }
// ];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}