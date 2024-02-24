import { Log } from "../utils";
import { resolve } from "path";
import { existsSync } from "fs";
import { writeFile, mkdir, readFile } from "fs/promises";
import { copy, ensureFile } from "fs-extra";
import { rimraf } from "rimraf";
import { parse } from "parse-package-name";
import { isValidFilename } from "../utils/file";
interface Options {
  log?: boolean;
}
interface BuildResult {
  cmdName: string;
  distDir: string;
  pkg: Record<string, any>;
  readmeContent: string;
}
export const build = async (options?: Options): Promise<BuildResult> => {
  const { log = true } = options || {};

  const cwd = process.cwd();
  const DIST_DIR = resolve(cwd, "./dist");
  const pkgPath = resolve(cwd, "./package.json");
  const readmePath = resolve(cwd, "./README.md");
  if (!existsSync(pkgPath)) {
    throw new Error("package.json not found");
  }
  const pkg = require(pkgPath);
  const mainPath = pkg.main;
  const cmdName = pkg.name;
  const readmeContent = existsSync(readmePath)
    ? await readFile(readmePath, "utf-8")
    : "";
  try {
    parse(cmdName);
  } catch (e) {
    throw new Error("invalid package name");
  }

  if (!isValidFilename(cmdName)) {
    throw new Error("invalid package name");
  }

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
      const filePath = resolve(DIST_DIR, "./", name);
      try {
        // 确保文件存在
        await ensureFile(filePath);
        await writeFile(filePath, asset.source, "binary");
      } catch (e) {
        Log.error(e);
      }
      await copy(pkgPath, resolve(DIST_DIR, "./package.json"));
      log && Log.info(`write ${name} finished`);
    }
  }
  return {
    cmdName,
    pkg,
    readmeContent,
    distDir: DIST_DIR,
  };
};
