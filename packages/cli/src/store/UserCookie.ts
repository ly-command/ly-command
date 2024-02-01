import { resolve } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs-extra";
export default class UserCookie {
  private readonly configPath: string;
  constructor(private readonly LY_COMMAND_DIR: string) {
    this.configPath = resolve(this.LY_COMMAND_DIR, "./config.json");
    if (!existsSync(this.configPath)) {
      this.writeConfig({});
    }
  }
  private writeConfig(config: object) {
    writeFileSync(this.configPath, JSON.stringify(config, null, 2));
  }
  public getConfig() {
    return JSON.parse(readFileSync(this.configPath, "utf-8"));
  }
  public setConfig(config: object) {
    const oldConfig = this.getConfig();
    const newConfig = { ...oldConfig, ...config };
    this.writeConfig(newConfig);
    return newConfig;
  }
}
