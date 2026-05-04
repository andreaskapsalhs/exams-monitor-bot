import chalk from "chalk";

export class Logger {
  private static formatTimestamp(): string {
    const ts = new Date().toLocaleString("el-GR", { timeZone: "Europe/Athens" });
    return chalk.dim.gray(`[${ts}]`);
  }

  public static info(msg: string): void {
    const badge = chalk.bgBlue.white.bold(" INFO ");
    const message = chalk.cyanBright(msg);
    console.log(`${this.formatTimestamp()} ${badge} ${message}`);
  }

  public static warn(msg: string): void {
    const badge = chalk.bgYellow.black.bold(" WARN ");
    const message = chalk.yellowBright(msg);
    console.log(`${this.formatTimestamp()} ${badge} ${message}`);
  }

  public static error(msg: string): void {
    const badge = chalk.bgRed.white.bold(" ERROR ");
    const message = chalk.redBright(msg);
    console.error(`${this.formatTimestamp()} ${badge} ${message}`);
  }
}
