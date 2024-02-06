import { Command } from "commander";
import { createServer } from "http";
import { parse } from "url";
import { Log } from "../utils";
import rootStore from "../store";

import { API_GATEWAY } from "../config";
const startServer = () => {
  let port = 54321;
  const server = createServer((req, res) => {
    const headers = req.headers;
    // cors
    const origin = headers["origin"];
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "POST") {
      const cookie = headers["auth"];
      const parsedUrl = parse(req.url ?? "", true);
      const userName = parsedUrl.query.user;
      if (!cookie) {
        return Log.error("login error");
      }
      res.end("ok", () => {
        // 获取查询参数对象
        rootStore.UserCookie.setConfig({ cookie });
        Log.success(`login success, welcome ${userName} !`);
        process.exit(0);
      });
    } else {
      res.end("");
    }
  });
  const onError = (e: Error & { code?: string }) => {
    if (e.code === "EADDRINUSE") {
      Log.debug(`port ${port} is in use, try another one`);
      port += 1;
      server.listen(port);
    } else {
      server.removeListener("error", onError);
    }
  };
  const listener = () => {
    server.removeListener("error", onError);
    import("open").then(({ default: open }) => {
      const url = API_GATEWAY + `/cli/login?callback=http://localhost:${port}`;
      Log.success(`open url login:  ${url}`);
      open(url);
    });
  };
  server.listen(port, listener);
  server.on("error", onError);
};

export const loginAction = () => {
  startServer();
};
const login = (program: Command) => {
  program.command("login").description("user login").action(loginAction);
};

export default login;
