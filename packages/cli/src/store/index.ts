import { getAppDataPath } from "appdata-path";
import { existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { UserCommands } from "./userCommands";

class RootStore {
  private readonly LY_COMMAND_DIR = resolve(getAppDataPath(), "./ly-command");
  public UserCommands: UserCommands;
  constructor() {
    if (!existsSync(this.LY_COMMAND_DIR)) {
      mkdirSync(this.LY_COMMAND_DIR);
    }
    this.UserCommands = new UserCommands(this.LY_COMMAND_DIR);
  }
}

const rootStore = new RootStore();
export default rootStore;
