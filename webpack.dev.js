const { resolve } = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const PORT = process.env.PORT || 3000;

module.exports = merge(common, {
<<<<<<< HEAD
    entry: [
        'core-js/stable',
        'regenerator-runtime/runtime',
        'webpack-dev-server/client?http://localhost:' + PORT,
        './index.js'
    ],
    devtool: false,
    mode: 'development',
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
            moduleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[hash]',
            fallbackModuleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[hash]',
            hashFunction: 'sha256'
        })
    ]
=======
    devtool: 'source-map',
    mode: 'development',
    devServer: {
        host: '0.0.0.0',
        static: {
            directory: resolve(__dirname, 'dist')
        },
        historyApiFallback: true,
        hot: false,
        port: PORT,
        allowedHosts: 'all',
        client: {
            logging: 'info'
        }
    }
>>>>>>> 02fff9e5e4f4887cf4492e23c51863e75689be74
});
