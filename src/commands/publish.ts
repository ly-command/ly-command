import { Command } from "commander";
import { Log } from "../utils";
import rootStore from "../store";
import { build } from "../common/build";

const action = async () => {
  const { cmdName, distDir } = await build();
  await rootStore.UserCommands.putCommand(cmdName, distDir);
  Log.success("publish finished");
};

const publish = (program: Command) => {
  Log.debug("publish");
  program.command("publish").action(action);
};

export default publish;
