const { translate } = require("bing-translate-api");
const args = process.argv.slice(2);
const content = args.join(" ");

translate(content, null, "en")
  .then((res) => {
    console.log(res?.translation);
  })
  .catch((err) => {
    console.error(err);
  });
