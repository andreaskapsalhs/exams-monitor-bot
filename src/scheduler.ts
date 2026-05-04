import { Client, TextChannel } from "discord.js";
import { config } from "./config";
import { Logger } from "./lib/logger";
import { getState, saveState } from "./lib/state";
import { fetchICal, fetchVersion, getEventCount } from "./lib/ical";
import { buildScheduleEmbed } from "./lib/embeds";

/**
 * Fetches the iCalendar feed endpoint and compares against the last known state.
 * Sends a discord notification if the schedule appeared or was updated.
 */
export async function checkSchedule(client: Client): Promise<void> {
  const channel = await client.channels.fetch(config.discord.channelId).catch(() => null);
  if (!channel || !(channel instanceof TextChannel)) {
    Logger.error("Το κανάλι δεν βρέθηκε ή δεν είναι κανάλι κειμένου — ελέγξτε το CHANNEL_ID.");
    return;
  }

  Logger.info(`Έλεγχος του iCal feed για το τελευταίο εξάμηνο...`);

  const [ical, version] = await Promise.all([
    fetchICal(),
    fetchVersion()
  ]);

  if (!ical) {
    Logger.warn("Αδυναμία λήψης του iCal feed, παράλειψη αυτού του κύκλου ελέγχου.");
    return;
  }

  const eventCount = getEventCount(ical);
  const now = new Date().toLocaleString("el-GR", { timeZone: "Europe/Athens" });

  Logger.info(`Βρέθηκαν ${eventCount} εξετάσεις, έκδοση: ${version}`);

  // No events yet
  if (eventCount === 0) {
    Logger.info("Δεν βρέθηκαν εξετάσεις ακόμα. Συνεχίζεται ο έλεγχος...");
    saveState({ eventCount: 0, version, lastCheck: now });
    return;
  }

  // Schedule appeared or updated
  const lastState = getState();
  const isNew = !lastState || lastState.eventCount === 0;
  const isUpdated = lastState &&
    (lastState.eventCount !== eventCount || lastState.version !== version);

  if (isNew) {
    Logger.info(`🎉 Το πρόγραμμα μόλις δημοσιεύτηκε! Βρέθηκαν ${eventCount} εξετάσεις.`);
    const embed = buildScheduleEmbed(eventCount, version);
    await channel.send({
      content: "@everyone 🎉 **Το πρόγραμμα εξεταστικής μόλις ανέβηκε!**",
      embeds: [embed],
    });
  } else if (isUpdated) {
    Logger.info(`📝 Ενημέρωση προγράμματος: ${lastState!.eventCount} → ${eventCount} εξετάσεις, έκδοση ${version}`);
    await channel.send({
      content: "📝 **Ενημέρωση:** Το πρόγραμμα εξεταστικής ενημερώθηκε!",
      embeds: [buildScheduleEmbed(eventCount, version)],
    });
  } else {
    Logger.info("Το πρόγραμμα παραμένει αμετάβλητο από τον τελευταίο έλεγχο.");
  }

  saveState({ eventCount: eventCount, version, lastCheck: now });
}
