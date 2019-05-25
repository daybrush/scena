import builder from "@daybrush/builder";
import cjsPlugin from "rollup-plugin-commonjs";
import resolvePlugin from "rollup-plugin-node-resolve";

const cjs = cjsPlugin({
    namedExports: {
        "react/umd/react.production.min.js": ["Component", "PureComponent", "createElement"],
        "react-dom/umd/react-dom.production.min.js": ["render", "findDOMNode"],
    }
});
const external = {
    "@daybrush/utils": "utils",
    "@daybrush/drag": "utils",
    "@egjs/axes": "eg.Axes",
};

const resolve = resolvePlugin();
const resolve2 = {
    ...resolve,
    resolveId(importee, importer) {
        if (importee === "react") {
            resolve.resolveId(importee, importer);
            return resolve.resolveId("react/umd/react.production.min.js", importer);
        } else if (importee === "react-dom") {
            resolve.resolveId(importee, importer);
            return resolve.resolveId("react-dom/umd/react-dom.production.min.js", importer);
        }
        return resolve.resolveId(importee, importer);
    }
};

// const alias = aliasPlugin({
//     "react": require.resolve("preact-compat"),
//     "react-dom": require.resolve("preact-compat"),
// });
export default builder([
    //   {
    //     name: "Timeline",
    //     input: "src/Timeline.ts",
    //     output: "./dist/timeline.js",
    //     external,
    //   },
    //   {
    //     name: "Timeline",
    //     input: "src/Timeline.ts",
    //     output: "./dist/timeline.min.js",
    //     uglify: true,
    //     external: {
    //         "@daybrush/utils": "utils",
    //         "@daybrush/drag": "utils",
    //         "@egjs/axes": "eg.Axes",
    //     },
    //   },
    {
        name: "Timeline",
        input: "src/Timeline.tsx",
        output: "./dist/timeline.pkgd.js",
        plugins: [cjs, resolve2],
    },
    //   {
    //     name: "Timeline",
    //     input: "src/Timeline.tsx",
    //     output: "./dist/timeline.pkgd.min.js",
    //     resolve: true,
    //     uglify: true,
    //   },
    //   {
    //     name: "Timeline",
    //     input: "src/Timeline.tsx",
    //     output: "./dist/timeline.esm.js",
    //     format: "es",
    //     plugins: [cjs, resolve2],
    //     outputOptions: {
    //         preserveModules: true,
    //     },
    //     external: {
    //         "@daybrush/utils": "utils",
    //         "@daybrush/drag": "utils",
    //         "@egjs/axes": "eg.Axes",
    //     },
    //   },

]);
