import { Command } from "commander";
import { Log, isObject } from "../utils";
import rootStore from "../store";
import { build } from "../common/build";
import { API_GATEWAY } from "../config";
import AdmZip from "adm-zip";
import { resolve } from "path";
import sanitize from "sanitize-filename";
import { tmpdir } from "os";
import { readFileSync } from "fs-extra";

const checkLogin = async (cookie: string = "none") => {
  // check login
  const res = await fetch(API_GATEWAY + "/api/auth/session", {
    headers: {
      cookie,
    },
  }).then((_) => _.json());
  if (isObject(res)) {
    return true;
  }
  return false;
};
interface ICommand {
  commandName: string;
  version: string;
  packageJSON: any;
  sourceId: string;
}
const publishCommandToRemote = async (
  command: ICommand,
  cookie: string
): Promise<{
  success: boolean;
  data: any;
  message: any;
}> => {
  const res = await fetch(API_GATEWAY + "/api/command", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
    body: JSON.stringify(command),
  }).then((res) => res.json());
  return res as any;
};

const uploadFile = async (
  cookie: string,
  filePath: string,
  filename: string
): Promise<{
  success: boolean;
  data: {
    name: string;
    url: string;
  };
  message: string;
}> => {
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([readFileSync(filePath)], { type: "application/zip" })
  );
  const res = await fetch(API_GATEWAY + "/api/file", {
    method: "POST",
    headers: {
      cookie,
    },
    body: formData,
  }).then((_) => _.json());
  return res as any;
};

const action = async (options: { remote: boolean }) => {
  const { remote = false } = options;

  if (remote) {
    // publish to remote
    Log.debug("publish to remote");
    const { cookie } = rootStore.UserCookie.getConfig();

    const isLogin = await checkLogin(cookie);

    if (isLogin) {
      // login success
      const { cmdName, distDir, pkg } = await build();
      const zip = new AdmZip();
      zip.addLocalFolder(distDir);
      const filename = sanitize(cmdName, { replacement: "-" }) + ".zip";
      const zipPath = resolve(tmpdir(), filename);

      zip.writeZip(zipPath, async (error) => {
        if (error) {
          Log.error("zip error: " + error.message);
        } else {
          Log.info("zip success");
          // 上传
          const { success, data } = await uploadFile(cookie, zipPath, filename);
          if (!success) {
            return Log.error("upload command error");
          } else {
            const res = await publishCommandToRemote(
              {
                commandName: cmdName,
                version: pkg.version,
                packageJSON: JSON.stringify(pkg),
                sourceId: data.name,
              },
              cookie
            );
            const { success, message } = res;
            if (success) {
              Log.success("publish finished");
            } else {
              Log.error("publish error: " + message || "");
            }
          }
        }
      });
    } else {
      Log.error('please login first, run "ly login" to login');
    }
  } else {
    const { cmdName, distDir } = await build();
    await rootStore.UserCommands.putCommand(cmdName, distDir);
    Log.success("publish finished");
  }
};

const publish = (program: Command) => {
  Log.debug("publish");
  program.command("publish").option("-r, --remote").action(action);
};

export default publish;
