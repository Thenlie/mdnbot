import 'dotenv/config'
import { REST, Routes } from 'discord.js';

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'mdn',
    description: 'Query the MDN Web Docs',
    type: 1,
    options: [
      {
        name: 'language',
        description: 'HTML, CSS or JavaScript',
        type: 3,
        required: true,
        choices: [
          {
            name: 'JavaScript',
            value: 'javascript'
          },
          {
            name: 'HTML',
            value: 'html'
          },
          {
            name: 'CSS',
            value: 'css'
          },
        ]
      },
      {
        name: 'query',
        description: 'query to search in MDN',
        type: 3,
        required: true
      },
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}