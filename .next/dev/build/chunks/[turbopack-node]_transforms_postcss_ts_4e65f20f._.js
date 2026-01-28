module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/incubation-frontend/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/8a66f_8f35cff7._.js",
  "chunks/[root-of-the-server]__a30c0661._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/incubation-frontend/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];