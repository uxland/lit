import { esbuildPlugin } from "@web/dev-server-esbuild";

export default {
  plugins: [esbuildPlugin({ ts: true })],
  coverageConfig: {
    report: true,
    reporters: ["json-summary", "text", "lcov"],
  },
  port: 4000,
};
