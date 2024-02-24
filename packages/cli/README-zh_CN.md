# ly-command

简体中文 | [English](./README.md)

集中管理 `node` 命令

## 安装

`npm install -g ly-command`

## 使用

### 发布第一个命令

1. `npm init -y` 初始化项目

```json
{
  "name": "hello", // 命令名称
  "version": "1.0.0", // 版本号
  "description": "first command", //命令描述
  "main": "index.js" //入口文件，可以是 js/ts 文件
}
```

2. 创建 `index.js`

```js
// index.js
console.log("hello ly");
```

3. 运行调试

在项目根目录执行 `ly start` 执行脚本命令

4. 发布命令到本地

在项目根目录 `ly publish`

5. 执行发布的命令

执行 `ly run hello ` 或者 `ly hello`

## 远程命令仓库

[远程命令仓库](https://ly-command.topjs.top/)

## 其他命令

| 命令                      | 描述           |
| ------------------------- | -------------- |
| ly install <commandName\> | 安装远程命令   |
| ly login                  | 登陆           |
| ly start                  | 开发执行命令   |
| ly run <commandName\>     | 执行命令       |
| ly list                   | 展示所有命令   |
| ly remove <commandName\>  | 移除指定命令   |
| ly clear                  | 清空所有命令   |
| ly publish                | 发布命令到本地 |
| ly publish -r             | 发布到远端     |
