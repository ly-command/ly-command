const Koa = require("koa");
const static = require("koa-static");
const { resolve } = require("path");
const app = new Koa();

app.use(static(resolve(__dirname + "/public")));

app.listen(3333, () => {
  console.log("Server is running at http://localhost:3333");
});
