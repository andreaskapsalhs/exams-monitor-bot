import * as fs from "fs";
import { config } from "../config";
import { Logger } from "./logger";
import type { BotState } from "../types";

let lastState: BotState | null = null;

export function getState(): BotState | null {
  return lastState;
}

export function loadState(): void {
  try {
    if (fs.existsSync(config.stateFile)) {
      lastState = JSON.parse(fs.readFileSync(config.stateFile, "utf-8"));
      Logger.info(`Φόρτωση προηγούμενης κατάστασης: ${lastState!.eventCount} εξετάσεις, έκδοση ${lastState!.version}`);
    }
  } catch {
    Logger.warn("Αδυναμία φόρτωσης αρχείου κατάστασης, δημιουργείται ένα νέο.");
  }
}

export function saveState(state: BotState): void {
  fs.writeFileSync(config.stateFile, JSON.stringify(state, null, 2));
  lastState = state;
}
