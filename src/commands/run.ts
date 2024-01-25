import { Command } from "commander";
import rootStore from "../store";
import { Log, quote, unQuoteStr } from "../utils";
import { $ } from "@cspotcode/zx";

const run = (program: Command) => {
  program
    .command("run")
    .description("run command")
    .argument("<commandName>", "command name")
    .allowUnknownOption()
    .action(async (commandName) => {
      const args = process.argv.slice(4);
      const command = await rootStore.UserCommands.getCommandByName(
        commandName
      );
      if (!command) {
        return Log.error(`not found command "${commandName}"`);
      }
      const { execJsFilePath } = command;
      // 不显示命令
      $.verbose = false;
      // 自定义转移函数，防止参数被转义
      $.quote = quote;
      // 显示输出
      await $`node ${execJsFilePath} ${unQuoteStr(args.join(" "))}`.pipe(
        process.stdout
      );
    });
};

export default run;
