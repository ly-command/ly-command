import { terminal } from "terminal-kit";
import registerCommands from "./registerCommands";

const bootstrap = async () => {
  await registerCommands();
  terminal.red("🚀🚀🚀 App started 🚀🚀🚀\n");
};

bootstrap();
