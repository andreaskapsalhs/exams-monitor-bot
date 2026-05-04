import { Client, GatewayIntentBits } from "discord.js";
import { config } from "../config";
import { Logger } from "./logger";
import readyEvent from "../events/ready";
import messageCreateEvent from "../events/messageCreate";

if (!config.discord.token) {
  Logger.error("Λείπει το DISCORD_TOKEN. Προσθέστε στο .env αρχείο το DISCORD_TOKEN=your_token");
  process.exit(1);
}
if (!config.discord.channelId) {
  Logger.error("Λείπει το CHANNEL_ID. Προσθέστε στο .env αρχείο το CHANNEL_ID=your_channel_id");
  process.exit(1);
}

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const events = [readyEvent, messageCreateEvent];

export function startBot() {
  for (const event of events) {
    if (event.once) {
      client.once(event.name as any, (...args: any[]) => (event.execute as any)(...args));
    } else {
      client.on(event.name as any, (...args: any[]) => (event.execute as any)(...args));
    }
  }

  client.login(config.discord.token);
}
