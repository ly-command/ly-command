import { Command } from "commander";
import path from "path";
import { globSync } from "fast-glob";
import { Log } from "./utils";
import pkg from "../package.json";

const createProgram = () => {
  const program = new Command();
  program.name(pkg.name);
  program.version(pkg.version);
  program.description(pkg.description);
  return program;
};

const registerCommands = async () => {
  const program = createProgram();
  const entries = globSync(path.resolve(__dirname, "./commands/*.ts"));
  for (const entry of entries) {
    const { default: command } = require(entry);
    if (command) command(program);
    else console.log(`Command ${entry} does not export a default function`);
  }
  Log.info("Commands registered \n");
};

export default registerCommands;
