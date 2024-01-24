import { Command } from "commander";
import rootStore from "../store";
import { Log } from "../utils";
import { $ } from "@cspotcode/zx";

const run = (program: Command) => {
  program
    .command("run")
    .description("run command")
    .argument("<commandName>", "command name")
    .action(async (commandName) => {
      const command = await rootStore.UserCommands.getCommandByName(
        commandName
      );
      if (!command) {
        return Log.error(`not found command "${commandName}"`);
      }
      const { execJsFilePath } = command;
      // 不显示命令
      $.verbose = false;
      // 显示输出
      await $`node ${execJsFilePath}`.pipe(process.stdout);
    });
};

export default run;
