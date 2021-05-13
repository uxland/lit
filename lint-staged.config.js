module.exports = {
  "*.ts": [
    "eslint -c .eslintrc.js",
    "prettier --config node_modules/@uxland/project-tools/lint/.prettierrc.js --ignore-path ./.prettierignore --write",
  ],
};
