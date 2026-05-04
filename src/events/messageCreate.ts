import { Events, type Message } from "discord.js";
import { Logger } from "../lib/logger";
import { fetchICal, fetchVersion, getEventCount } from "../lib/ical";
import { buildScheduleEmbed } from "../lib/embeds";

/**
 * Listen for the !test command and send a test embed with the current schedule.
 */
export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    if (message.author.bot || message.content !== "!test") return;

    Logger.info(`Εκτέλεση δοκιμής (!test) από τον χρήστη ${message.author.tag}`);

    // Use a previous semester (for example: sem_id=49 / 2025-26ΧΕΙΜ) for testing data
    const testIcalUrl = "https://www.iee.ihu.gr/exams-program/ical.php?full=1&sem_id=49";
    const testVersionUrl = "https://www.iee.ihu.gr/exams-program/program.php?full=1&sem_id=49";

    const [icalRes, versionRes] = await Promise.all([
      fetchICal(testIcalUrl),
      fetchVersion(testVersionUrl)
    ]);

    if (!icalRes) {
      message.reply("Δεν μπορούσαν να φορτωθούν τα δεδομένα.");
      return;
    }

    const eventCount = getEventCount(icalRes);
    const embed = buildScheduleEmbed(eventCount, versionRes);

    await message.reply({
      content: "🧪 **TEST ΕΙΔΟΠΟΙΗΣΗ:** (Αυτά είναι εικονικά δεδομένα από προηγούμενο εξάμηνο)",
      embeds: [embed],
    });
  },
};
