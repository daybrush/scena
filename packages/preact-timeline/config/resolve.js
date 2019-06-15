const resolve = require("rollup-plugin-node-resolve");


const resolvePlugin = resolve();
const customResolvePlugin = {
    ...resolvePlugin,
    resolveId(importee, importer) {
        if (importee === "react" || importee === "react-dom") {
            return resolvePlugin.resolveId(process.cwd() + "/src/compat/preact-compat.js", importer);
        }
        if (importee === "react-is") {
            return resolvePlugin.resolveId("react-is/cjs/react-is.production.min.js", importer);
        }
        if (importee === "styled-component") {
            return resolvePlugin.resolveId("styled-components/dist/styled-components.esm.js", importer);
        }
        return resolvePlugin.resolveId(importee, importer);
    },
}


module.exports = customResolvePlugin;
