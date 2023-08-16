import { esbuildPlugin } from "@web/dev-server-esbuild";
import { chromeLauncher } from "@web/test-runner-chrome";
import rollupCommonjs from "@rollup/plugin-commonjs";
import { fromRollup } from "@web/dev-server-rollup";
const commonjs = fromRollup(rollupCommonjs);

export default {
  testRunnerHtml: (testFramework) =>
    `<html>
      <body>
        <script>window.process = { env: { NODE_ENV: "development" } }</script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>`,
  browsers: [chromeLauncher({ concurrency: 1 })],
  plugins: [
    // commonjs({
    //   include: ["../../**/node_modules/puppeteer/lib/esm/puppeteer/**/*"],
    //   include: ["../../**/node_modules/puppeteer-core/lib/esm/puppeteer/**/*"],
    // }),
    esbuildPlugin({ ts: true }),
  ],
  coverageConfig: {
    report: true,
    reporters: ["json-summary", "text", "lcov"],
  },
  port: 4002,
};
