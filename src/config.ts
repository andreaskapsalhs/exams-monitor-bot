const BASE_URL = "https://www.iee.ihu.gr/exams-program";

export const config = {
  discord: {
    token: process.env.DISCORD_TOKEN ?? "",
    channelId: process.env.CHANNEL_ID ?? "",
  },
  // Convert minutes from .env to milliseconds for setInterval()
  checkInterval: (parseInt(process.env.CHECK_INTERVAL ?? "5")) * 60 * 1000,
  urls: {
    base: BASE_URL,
    ical: `${BASE_URL}/ical.php?full=1`,
    program: `${BASE_URL}/program.php?full=1`,
    page: `${BASE_URL}/`,
  },
  
  stateFile: "./data/state.json",
} as const;