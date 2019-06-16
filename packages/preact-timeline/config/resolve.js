const resolve = require("rollup-plugin-node-resolve");


const resolvePlugin = resolve();
const customResolvePlugin = {
    ...resolvePlugin,
    resolveId(importee, importer) {
        if (importee === "react" || importee === "react-dom") {
            return resolvePlugin.resolveId("preact-compat/dist/preact-compat.es.js", importer);
        }
        if (importee === "prop-types") {
            return resolvePlugin.resolveId(process.cwd() + "/src/compat/prop-types.js", importer);
        }
        if (importee === "react-is") {
            return resolvePlugin.resolveId(process.cwd() + "/src/compat/react-is.js", importer);
        }
        return resolvePlugin.resolveId(importee, importer);
    },
}


module.exports = customResolvePlugin;
