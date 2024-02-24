import { Command } from "commander";
import { tmpdir } from "os";
import { API_GATEWAY } from "../config";
import { resolve } from "path";
import AdmZip from "adm-zip";
import rootStore from "../store";
import { terminal } from "terminal-kit";
import { parse } from "parse-package-name";
import { createWriteStream } from "fs-extra";
import download from "download";
import Ora from "ora";
import { Log } from "../utils";
const fetchCommand = (commandName: string): Promise<any> => {
  return fetch(`${API_GATEWAY}/api/command/${commandName}`).then((res) =>
    res.json()
  );
};

const downloadFile = (url: string, destination: string) => {
  return new Promise((resolve, reject) => {
    const writeSteam = download(url).pipe(createWriteStream(destination));
    writeSteam.on("close", resolve);
    writeSteam.on("error", reject);
  });
};

const install = (program: Command) => {
  program
    .command("install")
    .description("install command")
    .argument("[<package-spec> ...]")
    .action(async (commands: string[]) => {
      const tmpdirPath = tmpdir();
      const downloads = commands.map((command) => {
        const ora = Ora({
          text: `installing command "${command}"`,
          color: "yellow",
        });
        return async () => {
          try {
            ora.start();
            const { version, name: commandName } = parse(command);
            const { success, data: list } = await fetchCommand(commandName);

            if (!success || !list?.length) {
              throw new Error(`not found command "${commandName}"`);
            }
            const latest = list[0];
            let sourceId = latest.sourceId;
            if (version !== "latest") {
              const cmd = list.find((cmd: any) => cmd.version === version);
              if (!cmd) {
                throw new Error(`not found version ${version}`);
              }
              sourceId = cmd.sourceId;
            }
            const zipPath = resolve(tmpdirPath, sourceId);

            await downloadFile(`${API_GATEWAY}/api/file/${sourceId}`, zipPath);
            const zip = new AdmZip(zipPath);
            zip.extractAllTo(
              resolve(rootStore.UserCommands.USER_COMMAND_DIR, commandName),
              true
            );
            ora.succeed(`installed command "${command}"`);
          } catch (e) {
            ora.clear();
            throw e;
          }
        };
      });
      try {
        for (const download of downloads) {
          await download();
        }
        Log.success(`install success`);
      } catch (e) {
        terminal.red("\n");
        terminal.red(e);
        process.exit();
      }
    });
};

export default install;
