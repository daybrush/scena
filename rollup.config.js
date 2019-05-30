import builder from "@daybrush/builder";

const external = {
    "scenejs": "Scene",
};

export default builder([
    {
        name: "Timeline",
        input: "src/index.ts",
        output: "./dist/timeline.js",
        external,
        resolve: true,
    },
    {
        name: "Timeline",
        input: "src/index.ts",
        output: "./dist/timeline.min.js",
        uglify: true,
        external,
        resolve: true,
    },
    {
        name: "Timeline",
        input: "src/index.ts",
        output: "./dist/timeline.pkgd.js",
        resolve: true,
    },
    {
        name: "Timeline",
        input: "src/index.ts",
        output: "./dist/timeline.pkgd.min.js",
        resolve: true,
        uglify: true,
    },
    {
        name: "Timeline",
        input: "src/index.ts",
        output: "./dist/timeline.cjs.js",
        format: "cjs",
    },
    {
        name: "Timeline",
        input: "src/index.ts",
        output: "./dist/timeline.esm.js",
        format: "es",
    },
]);
