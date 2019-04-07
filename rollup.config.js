import builder from "@daybrush/builder";

export default builder([
  {
    name: "Timeline",
    input: "src/Timeline.ts",
    output: "./dist/timeline.js",
    external: {
        "@daybrush/utils": "utils",
        "@daybrush/drag": "utils",
        "@egjs/axes": "eg.Axes",
    },
  },
  {
    name: "Timeline",
    input: "src/Timeline.ts",
    output: "./dist/timeline.min.js",
    uglify: true,
    external: {
        "@daybrush/utils": "utils",
        "@daybrush/drag": "utils",
        "@egjs/axes": "eg.Axes",
    },
  },
  {
    name: "Timeline",
    input: "src/Timeline.ts",
    output: "./dist/timeline.pkgd.js",
    resolve: true,
  },
  {
    name: "Timeline",
    input: "src/Timeline.ts",
    output: "./dist/timeline.pkgd.min.js",
    resolve: true,
    uglify: true,
  },
  {
    name: "Timeline",
    input: "src/Timeline.ts",
    output: "./dist/timeline.esm.js",
    format: "es",
    external: {
        "@daybrush/utils": "utils",
        "@daybrush/drag": "utils",
        "@egjs/axes": "eg.Axes",
    },
  },

]);
