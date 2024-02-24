# ly-command

[简体中文](./README-zh_CN.md) | English

Centralized management of `node` commands

## Installation

`npm install -g ly-command`

## Usage

### Publishing your first command

1. Initialize your project with `npm init -y`

```json
{
  "name": "hello", // Command name
  "version": "1.0.0", // Version number
  "description": "first command", // Command description
  "main": "index.js" // Entry file, can be a js/ts file
}
```

2. Create `index.js`

```js
// index.js
console.log("hello ly");
```

3. Run Debugging

Execute the script command `ly start` in the project root directory.

4. Publish Command Locally

In the project root directory, execute `ly publish`.

5. Execute the Published Command

Run `ly run hello` or `ly hello`.

## Remote Command Repository

[Remote Command Repository](https://ly-command.topjs.top/)

## Other Commands

| Command                   | Description              |
| ------------------------- | ------------------------ |
| ly install <commandName\> | Install remote command   |
| ly login                  | Login                    |
| ly start                  | Start executing command  |
| ly run <commandName\>     | Run command              |
| ly list                   | Show all commands        |
| ly remove <commandName\>  | Remove specified command |
| ly clear                  | Clear all commands       |
| ly publish                | Publish command locally  |
| ly publish -r             | Publish to remote        |
