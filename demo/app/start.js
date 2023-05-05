require('dotenv').config();
const {fuse} = require('./node_modules/@uxland/project-tools/fuse');
fuse({
  entry: 'demo/index.ts',
  baseStyles: '../styles/styles.scss',
  webIndex: 'demo/index.html',
  devServer: true,
  workspaces: ['demo', 'packages'],
  env: {
    API_URL: process.env.API_URL,
    NODE_ENV: 'development',
  },
}).runDev();
