import { config } from "../config";
import { Logger } from "./logger";


/**
 * Fetch the iCal feed (to get calendar.ics).
 * When no schedule is published, the feed contains 0 VEVENT blocks.
 * When published, its full of VEVENT entries with exams data.
 */
export async function fetchICal(url: string = config.urls.ical): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "Cache-Control": "no-cache" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    Logger.warn(`Σφάλμα λήψης iCal: ${err}`);
    return null;
  }
}

/**
 * Fetch the program.php page to extract the version string.
 * e.g. "v.0.00" (unpublished) vs "v.1.10" (published)
 */
export async function fetchVersion(url: string = config.urls.program): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "Cache-Control": "no-cache" },
    });
    if (!res.ok) return "unknown";
    const html = await res.text();

    // Regex to find version pattern like: v.0.00 or v.1.10
    const match = html.match(/v\.(\d+\.\d+)/);
    return match ? match[0] : "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * Count VEVENT blocks from raw iCal text to determine if the schedule is populated.
 */
export function getEventCount(ical: string): number {
  const blocks = ical.split("BEGIN:VEVENT");
  return Math.max(0, blocks.length - 1);
}
