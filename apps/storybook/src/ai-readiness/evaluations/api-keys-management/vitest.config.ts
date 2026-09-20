import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../../../../../../", import.meta.url));
const reactNodeModules = resolve(repositoryRoot, "packages/react/node_modules");

export default {
  resolve: {
    alias: [
      {
        find: /^@testing-library\/react$/,
        replacement: resolve(reactNodeModules, "@testing-library/react/dist/index.js"),
      },
      {
        find: /^@testing-library\/user-event$/,
        replacement: resolve(reactNodeModules, "@testing-library/user-event/dist/cjs/index.js"),
      },
      {
        find: /^react$/,
        replacement: resolve(reactNodeModules, "react/index.js"),
      },
      {
        find: /^react-dom\/client$/,
        replacement: resolve(reactNodeModules, "react-dom/client.js"),
      },
    ],
  },
  test: {
    environment: "jsdom",
    include: ["**/ApiKeysEvaluation.test.tsx"],
  },
};
