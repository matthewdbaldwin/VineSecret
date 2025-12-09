const { resolve } = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const PORT = process.env.PORT || 3000;

module.exports = merge(common, {
    devtool: 'source-map',
    mode: 'development',
    devServer: {
        host: '0.0.0.0',
        contentBase: resolve(__dirname, 'dist'),
        historyApiFallback: true,
        hot: false,
        publicPath: '/',
        port: PORT,
        disableHostCheck: true
    }
});
