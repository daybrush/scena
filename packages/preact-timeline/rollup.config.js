import builder from "@daybrush/builder";
import cjs from "rollup-plugin-commonjs";
import alias from "rollup-plugin-alias";
import resolve from "rollup-plugin-node-resolve";


const cjsPlugin = cjs({
    namedExports: {
        "node_modules/preact-compat/dist/preact-compat.min.js": ["findDOMNode"],
    }
});

const aliasPlugin = alias({
    "react": "preact",
    "react-dom": "preact",
});

const resolvePlugin = resolve();
const customResolvePlugin =  {
    ...resolvePlugin,
    resolveId(importee, importer) {
        console.log(importee);
        if (importee === "react" || importee === "react-dom") {
            return resolvePlugin.resolveId("node_modules/preact-compat/dist/preact-compat.min.js", importer);
        }
        return resolvePlugin.resolveId(importee, importer);
    },
}

const defaultOptions = {
    tsconfig: "tsconfig.build.json",
    external: {
        "@daybrush/utils": "utils",
        "@daybrush/drag": "utils",
        "@egjs/axes": "eg.Axes",
        "keycon": "KeyController",
    },
    plugins: [
        customResolvePlugin,
        aliasPlugin,
        cjsPlugin,
    ],
};

export default builder([
    {
        ...defaultOptions,
        input: "src/preact-timeline/index.ts",
        output: "./dist/timeline.esm.js",
        format: "es",
        // resolve: true,
    },
    {
        ...defaultOptions,
        input: "src/preact-timeline/index.ts",
        output: "./dist/timeline.cjs.js",
        format: "cjs",
        // resolve: true,
    },
]);
