import { Events, type Client, TextChannel } from "discord.js";
import { config } from "../config";
import { Logger } from "../lib/logger";
import { loadState } from "../lib/state";
import { checkSchedule } from "../scheduler";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    Logger.info(`✅ Το Bot συνδέθηκε ως ${client.user?.tag}`);

    const channel = client.channels.cache.get(config.discord.channelId) as TextChannel | undefined;
    const channelName = channel ? `#${channel.name}` : `ID:${config.discord.channelId}`;

    Logger.info(`📡 Έλεγχος τελευταίου εξαμήνου κάθε ${config.checkInterval / 60_000} λεπτά στο κανάλι ${channelName}`);
    Logger.info(`🔗 iCal: ${config.urls.ical}`);

    loadState();
    checkSchedule(client);
    setInterval(() => checkSchedule(client), config.checkInterval);
  },
};
