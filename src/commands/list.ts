import { Command } from "commander";
import rootStore from "../store";
import { Log } from "../utils";

const list = (program: Command) => {
  program
    .command("list")
    .description("user command list")
    .action(async () => {
      const commands = await rootStore.UserCommands.getAllCommands();

      const formatResult = commands.map((command) => command.name).join("\t");

      Log.info(formatResult);
    });
};

export default list;
