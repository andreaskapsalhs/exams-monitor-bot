import { EmbedBuilder } from "discord.js";
import { config } from "../config";

export function buildScheduleEmbed(eventCount: number, version: string): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle("📅  Το πρόγραμμα εξεταστικής δημοσιεύτηκε!")
    .setDescription(
      [
        `Βρέθηκαν **${eventCount}** εξετάσεις στο πρόγραμμα. \n`,
        `📋 [Επίσημη ιστοσελίδα](${config.urls.page})`,
        `📄 [Πλήρες πρόγραμμα](${config.urls.program})`,
        `📆 [Αρχείο Ημερολογίου (iCalendar)](${config.urls.ical})`,
        "",
        `\`Έκδοση: ${version}\``,
      ].join("\n")
    )
    .setColor(0x2ec332)
    .setTimestamp()
    .setFooter({ text: "IEE IHU Exam Monitor" });

  return embed;
}

