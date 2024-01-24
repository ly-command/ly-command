import { Command } from "commander";
import { Log } from "../utils";
import { resolve } from "path";
import { existsSync } from "fs";
import { writeFile, mkdir } from "fs/promises";
import { rimraf } from "rimraf";
import rootStore from "../store";

const action = async () => {
  const cwd = process.cwd();
  const DIST_DIR = resolve(cwd, "./dist");
  const pkgPath = resolve(cwd, "./package.json");
  if (!existsSync(pkgPath)) {
    Log.error("package.json not found");
    return;
  }
  const pkg = require(pkgPath);
  const mainPath = pkg.main;
  const cmdName = pkg.name;
  if (!cmdName) {
    return Log.error("package.json name is missing");
  }
  if (!mainPath) {
    return Log.error("package.json does not contain a main field");
  } else {
    const main = resolve(cwd, mainPath);
    Log.debug(`package.json main: ${main}`);
    if (!existsSync(main)) {
      return Log.error(
        `The "main" field of package.json corresponds to the "${mainPath}" file that does not exist`
      );
    }
    const ncc = require("@vercel/ncc");
    const options = { sourceMap: true };
    const { code, map, assets } = await ncc(main, options);
    if (existsSync(DIST_DIR)) {
      await rimraf(DIST_DIR);
    }
    await mkdir(DIST_DIR);
    Log.info("mkdir dist finished");
    await writeFile(resolve(DIST_DIR, "./index.js"), code);
    Log.info("write index.js finished");
    await writeFile(resolve(DIST_DIR, "./index.js.map"), map);
    Log.info("write index.js.map finished");
    for (const name in assets) {
      const asset = assets[name];
      await writeFile(resolve(DIST_DIR, "./", name), asset.source, "binary");
      Log.info(`write ${name} finished`);
    }
    await rootStore.UserCommands.putCommand(cmdName, DIST_DIR);
    Log.success("publish finished");
  }
};

const publish = (program: Command) => {
  Log.debug("publish");
  program.command("publish").action(action);
};

export default publish;
