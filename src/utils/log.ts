import { terminal } from "terminal-kit";
export class Log {
  static readonly name = "ly";
  static get prefix() {
    return `[${Log.name}] `;
  }
  static error(message: string) {
    terminal.red(Log.prefix + message);
  }
  static info(message: string) {
    terminal.blue(Log.prefix + message);
  }
  static success(message: string) {
    terminal.green(Log.prefix + message);
  }
  static warning(message: string) {
    terminal.yellow(Log.prefix + message);
  }
}
