import { Command } from "commander";

const publish = (program: Command) => {
  program.command("publish").action(() => {
    console.log("publish");
  });
};

export default publish;
