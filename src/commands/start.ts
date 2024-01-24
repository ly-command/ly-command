import { Command } from "commander";
import { build } from "../common/build";
import { resolve } from "path";
import { $ } from "@cspotcode/zx";
const start = (program: Command) => {
  program.command("start").action(async () => {
    const { distDir } = await build({ log: false });
    const args = process.argv.slice(3);
    const jsPath = resolve(distDir, "./index.js");
    await $`node ${jsPath} ${args.join(" ")}`;
  });
};

export default start;
