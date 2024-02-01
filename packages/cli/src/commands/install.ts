import fetch from "node-fetch";
import ProgressBar from "progress";
import fs from "fs";
import { Command } from "commander";
import { tmpdir } from "os";
import { API_GATEWAY } from "../config";
import { resolve } from "path";
import AdmZip from "adm-zip";
import rootStore from "../store";
import { terminal } from "terminal-kit";
import { parse } from "parse-package-name";
const fetchCommand = (commandName: string) => {
  return fetch(`${API_GATEWAY}/api/command/${commandName}`).then((res) =>
    res.json()
  );
};

const downloadFile = async (url: string, destination: string) => {
  const response = await fetch(url);
  const totalBytes = parseInt(response.headers.get("content-length") || "0");
  const progressBar = new ProgressBar("Downloading [:bar] :percent :etas", {
    width: 40,
    complete: "=",
    incomplete: " ",
    renderThrottle: 1,
    total: totalBytes,
    clear: false,
  });

  const fileStream = fs.createWriteStream(destination);

  response.body.pipe(fileStream);

  response.body.on("data", (chunk: Buffer) => {
    progressBar.tick(chunk.length);
  });

  response.body.on("end", () => {});
};

const install = (program: Command) => {
  program
    .command("install")
    .description("install command")
    .argument("[<package-spec> ...]")
    .action(async (commands: string[]) => {
      const tmpdirPath = tmpdir();
      const downloads = commands.map(async (command) => {
        const { version, name: commandName } = parse(command);
        const { success, data: list } = await fetchCommand(commandName);

        if (!success || !list?.length) {
          throw new Error(`not found command "${commandName}" `);
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
        console.log(
          resolve(rootStore.UserCommands.USER_COMMAND_DIR, commandName)
        );
      });
      try {
        await Promise.all(downloads);
      } catch (e) {
        terminal.red(e);
      }
    });
};

export default install;
