const { resolve } = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.dev');
const npm_config = require('./package.json');
const PORT = process.env.PORT || 3000;

const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
    ...config.devServer,
    proxy: npm_config.proxy,
    contentBase: resolve(__dirname, 'dist'),
    host: '0.0.0.0'
});

server.listen(PORT, '0.0.0.0', err => {
    if (err) {
        console.log('\n\x1b[37m%s\x1b[33m%s\x1b[37m%s\x1b[36m%s\x1b[33m%s\x1b[0m\n\n', '========', ' REACT DEV SERVER LISTEN ERROR ', '========','\nYou probably already have a server running on PORT:', PORT);

        console.error(err);
        server.close();
    }
});
