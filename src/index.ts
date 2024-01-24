#! /usr/bin/env node
import registerCommands from "./registerCommands";
import { Log } from "./utils";

const bootstrap = async () => {
  Log.debug("🚀started\n");
  await registerCommands();
};

bootstrap();
