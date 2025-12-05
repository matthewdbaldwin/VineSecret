const { resolve } = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const PORT = process.env.PORT || 3000;

module.exports = merge(common, {
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
});
