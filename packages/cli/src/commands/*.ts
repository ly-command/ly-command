import { Command } from "commander";
import rootStore from "../store";
import { $ } from "@cspotcode/zx";
import { runJs } from "./run";
export default (program: Command) => {
  program
    .command("*")
    .allowUnknownOption()
    .action(async () => {
      const commandName = program.args[0];
      const command = await rootStore.UserCommands.getCommandByName(
        commandName
      );
      if (command) {
        runJs(commandName, program.args.slice(1));
      } else {
        program.error(`not found command "${commandName}"`);
      }
    });
};
