#! /usr/bin/env node
import registerCommands from "./registerCommands";
import { Log } from "./utils";
const bootstrap = async () => {
  await registerCommands();
  Log.success("🚀🚀🚀 App started 🚀🚀🚀\n");
};

bootstrap();
