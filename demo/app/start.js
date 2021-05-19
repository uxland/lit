require("dotenv").config();
const { fuse } = require("../../node_modules/@uxland/project-tools/fuse");
fuse({
  entry: "demo/index.ts",
  baseStyles: "../styles/styles.scss",
  webIndex: "demo/index.html",
  devServer: true,
  env: {
    API_URL_PRE: process.env.API_URL_PRE,
    API_URL_PRO: process.env.API_URL_PRO,
    API_URL_LOCAL: process.env.API_URL_LOCAL,
    API_TOKEN: process.env.API_TOKEN,
    NODE_ENV: "development",
    USERNAME: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD,
  },
}).runDev();
