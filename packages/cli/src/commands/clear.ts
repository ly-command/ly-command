import { Command } from "commander";
import rootStore from "../store";
import { Log } from "../utils";

const clear = (program: Command) => {
  program
    .command("clear")
    .description("clear all command")
    .action(async () => {
      await rootStore.UserCommands.clearAllCommands();
      Log.success("clear success");
    });
};

export default clear;
