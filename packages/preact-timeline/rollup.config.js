import builder from "@daybrush/builder";
import cjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";


const cjsPlugin = cjs({
    namedExports: {
        "node_modules/preact-compat/dist/preact-compat.min.js": ["findDOMNode"],
    }
});

const resolvePlugin = resolve();
const customResolvePlugin =  {
    ...resolvePlugin,
    resolveId(importee, importer) {
        if (importee === "react" || importee === "react-dom") {
            return resolvePlugin.resolveId("preact-compat", importer);
        } else if (importee === "prop-types") {
            return resolvePlugin.resolveId(process.cwd() + "/src/preact-timeline/no-prop-types.ts", importer);
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
        "preact": "Preact",
    },
    plugins: [
        customResolvePlugin,
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
