import {fileURLToPath} from 'node:url';
import {esbuildPlugin} from '@web/dev-server-esbuild';

const tsconfig = fileURLToPath(new URL('./tsconfig.base.json', import.meta.url));

export default {
  nodeResolve: true,
  files: ['test/unit/**/*.spec.ts'],
  plugins: [esbuildPlugin({ts: true, tsconfig})],
  testRunnerHtml: testFramework => `<html>
    <body>
      <script>var exports = {};
      window.process = {env: {NODE_ENV: 'development'}};</script>
      <script type="module" src="${testFramework}"></script>
    </body>
  </html>`,
};
