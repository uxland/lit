import { esbuildPlugin } from "@web/dev-server-esbuild";
import { importMapsPlugin } from "@web/dev-server-import-maps";

export default {
  plugins: [
    esbuildPlugin({ ts: true }),
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            "../../src/view-factory": "/test/unit/mocks/view-factory.js",
          },
        },
      },
    }),
  ],
  coverageConfig: {
    report: true,
    reporters: ["json-summary", "text", "lcov"],
  },
  port: 4004,
};
