import { getAppDataPath } from "appdata-path";
import { existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { UserCommands } from "./userCommands";
import UserCookie from "./UserCookie";

class RootStore {
  private readonly LY_COMMAND_DIR = resolve(getAppDataPath(), "./ly-command");
  public UserCommands: UserCommands;
  public UserCookie: UserCookie;
  constructor() {
    if (!existsSync(this.LY_COMMAND_DIR)) {
      mkdirSync(this.LY_COMMAND_DIR);
    }
    this.UserCommands = new UserCommands(this.LY_COMMAND_DIR);
    this.UserCookie = new UserCookie(this.LY_COMMAND_DIR);
  }
}

const rootStore = new RootStore();
export default rootStore;
