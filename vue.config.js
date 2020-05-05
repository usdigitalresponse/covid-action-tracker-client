process.env.VUE_APP_VERSION = require('./package.json').version

const devPort = 8081;

module.exports = {
    runtimeCompiler: true,
    devServer: {
        hot: true,
        writeToDisk: true,
        liveReload: false,
        disableHostCheck: true, // process.env.NODE_ENV === 'development'
        sockPort: devPort,
        port: devPort,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    },
/*
    publicPath: process.env.NODE_ENV === "production" ? process.env.ASSET_PATH || "/" : `http://localhost:${devPort}/`,

    configureWebpack: {
        output: {
            filename: "app.js",
            hotUpdateChunkFilename: "hot/hot-update.js",
            hotUpdateMainFilename: "hot/hot-update.json"
        },
        optimization: {
            splitChunks: false
        }
    },
    filenameHashing: true,
    css: {
        extract: {
            filename: "app.css"
        }
    }    
*/
}