import { esbuildPlugin } from "@web/dev-server-esbuild";

export default {
  testRunnerHtml: (testFramework) =>
    `<html>
      <body>
        <script>var exports = {};</script>
        <script>window.process = { env: { NODE_ENV: "development" } }</script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>`,
  plugins: [esbuildPlugin({ ts: true })],
  coverageConfig: {
    report: true,
    reporters: ["json-summary", "text", "lcov"],
  },
  port: 4000,
};
