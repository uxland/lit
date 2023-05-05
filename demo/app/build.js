// require("dotenv").config();
const {fuse} = require('./node_modules/@uxland/project-tools/fuse');
const pkg = require('./package.json');
fuse({
  entry: 'demo/index.ts',
  baseStyles: '../styles/styles.scss',
  webIndex: 'demo/index.html',
  workspaces: ['demo', 'packages'],
  devServer: false,
  env: {
    API_URL: process.env.API_URL,
    NODE_ENV: 'production',
  },
}).runProd({
  uglify: true,
  target: 'browser',
  bundles: {
    app: './app.$hash.js',
    mapping: [
      {matching: 'webcomponents*', target: './vendor.webcomponents.$hash.js'},
      {matching: '@material*', target: './vendor.material.$hash.js'},
      {matching: '@uxland*', target: './vendor.uxland.$hash.js'},
      {matching: 'lit-*', target: './vendor.lit.$hash.js'},
      {matching: 'polymer*', target: './vendor.polymer.$hash.js'},
    ],
    vendor: './vendor.$hash.js',
  },
});
