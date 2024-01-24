import { Command } from "commander";
import rootStore from "../store";
import { Log } from "../utils";

const remove = (program: Command) => {
  program
    .command("remove")
    .description("remove command")
    .argument("<commandName>", "command name")
    .action(async (commandName) => {
      await rootStore.UserCommands.deleteCommandByName(commandName);
      Log.success(`remove command "${commandName}" success`);
    });
};

export default remove;
