import { terminal } from "terminal-kit";
import { isString } from ".";

const isDebug = process.env.NODE_ENV === "debug";
export class Log {
  static readonly appName = "ly";
  static get prefix() {
    return ``;
  }
  private static format(message: any, _prefix?: string) {
    const prefix = _prefix ?? Log.prefix;
    const content = isString(message)
      ? message
      : JSON.stringify(message, null, 2);
    return prefix + content + "\n";
  }
  static error(message: any) {
    terminal.red(this.format(message));
  }
  static info(message: any) {
    terminal.blue(this.format(message));
  }
  static success(message: any) {
    terminal.green(this.format(message));
  }
  static warning(message: any) {
    terminal.yellow(this.format(message));
  }
  static debug(message: any) {
    if (!isDebug) return;
    terminal.magenta(this.format(message, "[debug] "));
  }
}
