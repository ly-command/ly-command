import { Command } from "commander";
import { build } from "../common/build";
import { resolve } from "path";
import { $ } from "@cspotcode/zx";
import { quote, unQuoteStr } from "../utils";
const start = (program: Command) => {
  program
    .command("start")
    .description("dev start command")
    .allowUnknownOption()
    .action(async () => {
      const { distDir } = await build({ log: false });
      const args = process.argv.slice(3);
      const jsPath = resolve(distDir, "./index.js");
      // 自定义转移函数，防止参数被转义
      $.quote = quote;
      await $`node ${jsPath} ${unQuoteStr(args.join(" "))}`;
    });
};

export default start;
