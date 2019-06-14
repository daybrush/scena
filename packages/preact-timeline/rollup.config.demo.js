import resolve from "rollup-plugin-node-resolve";
import builder from "@daybrush/builder";
import css from "rollup-plugin-css-bundle";
import commonjs from "rollup-plugin-commonjs";

const resolvePlugin = resolve();
const customResolvePlugin = {
    ...resolvePlugin,
    resolveId(importee, importer) {
        if (importee === "react" || importee === "react-dom") {
            return resolvePlugin.resolveId(process.cwd() + "/src/preact-timeline/preact-compat.ts", importer);
        }
        if (importee === "react-is") {
            return resolvePlugin.resolveId("react-is/cjs/react-is.production.min.js", importer);
        }
        if (importee === "styled-component") {
            // styled-components.browser.esm.js
            return resolvePlugin.resolveId("styled-components/dist/styled-components.browser.esm.js", importer);
        }
        return resolvePlugin.resolveId(importee, importer);
    },
}


const noenv = {
    intro: function intro() {
        return `
    var rollupEnv = {};
    if (typeof window !== "undefined") {
        var process = {};
    }
  process.env = process.env || {};
  Object.keys(rollupEnv).forEach(function (prop) {
      process.env[prop] = rollupEnv[prop];
  });`;
    },
};

export default builder({
    input: "./src/demo/index.tsx",
    tsconfig: "./tsconfig.build.json",
    sourcemap: false,
    format: "umd",
    output: "./demo/dist/index.js",
    name: "app",
    exports: "named",
    plugins: [
        customResolvePlugin,
        css({ output: "./demo/dist/index.css" }),
        noenv,
        commonjs({
            namedExports: {
                "node_modules/react-is/umd/react-is.producution.min.js": ["isElement", "isValidElementType", "ForwardRef"],
                "node_modules/shallowequal/index.js": undefined,
            },
        }),
    ],
});
