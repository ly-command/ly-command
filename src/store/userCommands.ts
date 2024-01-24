import { existsSync, mkdirSync, readdirSync } from "fs";
import { resolve, parse } from "path";
import { rimraf } from "rimraf";
import { copy } from "fs-extra";
import { Log } from "../utils";
interface ICommandInfo {
  name: string;
  execJsFilePath: string;
}
export class UserCommands {
  private readonly USER_COMMAND_DIR: string;
  constructor(private readonly LY_COMMAND_DIR: string) {
    this.USER_COMMAND_DIR = resolve(this.LY_COMMAND_DIR, "./commands");
    if (!existsSync(this.USER_COMMAND_DIR)) {
      mkdirSync(this.USER_COMMAND_DIR);
    }
  }
  public async getCommandByName(name: string): Promise<ICommandInfo | null> {
    const commandDir = resolve(this.USER_COMMAND_DIR, name);
    if (!existsSync(commandDir)) {
      return null;
    } else {
      return {
        name,
        execJsFilePath: resolve(commandDir, "index.js"),
      };
    }
  }
  public async putCommand(name: string, copyDir: string) {
    const commandDir = resolve(this.USER_COMMAND_DIR, name);
    if (existsSync(commandDir)) {
      await rimraf(commandDir);
    }
    await copy(copyDir, commandDir);
  }
  public async deleteCommandByName(name: string) {
    const commandDir = resolve(this.USER_COMMAND_DIR, name);
    if (!existsSync(commandDir)) {
      Log.error(`not found command "${name}"`);
    } else {
      await rimraf(commandDir);
    }
  }
  public async getAllCommands(): Promise<ICommandInfo[]> {
    const files = readdirSync(this.USER_COMMAND_DIR);
    const commands: ICommandInfo[] = [];
    for (const file of files) {
      const { name } = parse(file);
      const commandDir = resolve(this.USER_COMMAND_DIR, name);
      commands.push({ name, execJsFilePath: resolve(commandDir, "index.js") });
    }
    return commands;
  }
  public async clearAllCommands() {
    await rimraf(this.USER_COMMAND_DIR + "/*");
  }
}
