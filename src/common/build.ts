import { Log } from "../utils";
import { resolve } from "path";
import { existsSync } from "fs";
import { writeFile, mkdir } from "fs/promises";
import { rimraf } from "rimraf";
interface Options {
  log?: boolean;
}
export const build = async (
  options?: Options
): Promise<{ cmdName: string; distDir: string }> => {
  const { log = true } = options || {};

  const cwd = process.cwd();
  const DIST_DIR = resolve(cwd, "./dist");
  const pkgPath = resolve(cwd, "./package.json");
  if (!existsSync(pkgPath)) {
    throw new Error("package.json not found");
  }
  const pkg = require(pkgPath);
  const mainPath = pkg.main;
  const cmdName = pkg.name;
  const nccOptions = pkg.ly ?? {};
  if (!cmdName) {
    throw new Error("package.json name is missing");
  }
  if (!mainPath) {
    throw new Error("package.json does not contain a main field");
  } else {
    const main = resolve(cwd, mainPath);
    Log.debug(`package.json main: ${main}`);
    if (!existsSync(main)) {
      throw new Error(
        `The "main" field of package.json corresponds to the "${mainPath}" file that does not exist`
      );
    }
    const ncc = require("@vercel/ncc");
    const options = { sourceMap: true, quiet: !log, ...nccOptions };

    const { code, map, assets } = await ncc(main, options);
    if (existsSync(DIST_DIR)) {
      await rimraf(DIST_DIR);
    }
    await mkdir(DIST_DIR);
    log && Log.info("mkdir dist finished");
    await writeFile(resolve(DIST_DIR, "./index.js"), code);
    log && Log.info("write index.js finished");
    await writeFile(resolve(DIST_DIR, "./index.js.map"), map);
    log && Log.info("write index.js.map finished");
    for (const name in assets) {
      const asset = assets[name];
      await writeFile(resolve(DIST_DIR, "./", name), asset.source, "binary");
      log && Log.info(`write ${name} finished`);
    }
  }
  return {
    cmdName,
    distDir: DIST_DIR,
  };
};
