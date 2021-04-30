const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const production = process.env.NODE_ENV === 'production';

console.log('*** Building production?', production);

const port = 3000;
const publicPath = '/';

const config = {
    mode: production ? 'production' : 'development',
    entry: './src/app/main.js',
    output: {
        chunkFilename: 'chunk-[chunkhash].js',
        filename: production ? '[name]-[hash].min.js' : '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath
    },
    devtool: production ? 'source-map' : 'inline-source-map',
    module: {
        rules: [
            { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader',
                    {
                        loader:  'fast-sass-loader',
                        options: {
                            implementation: require('node-sass'),
                            includePaths: [ './src/styles', './node_modules' ]
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            'react': 'preact/compat',
            'react-dom/test-utils': 'preact/test-utils',
            'react-dom': 'preact/compat',
            '~': path.resolve(__dirname, 'src/app'),
        },
        modules: [
            path.resolve(__dirname, 'src/app'),
            'node_modules',
        ],
        extensions: ['.js', '.jsx']
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: production ? 5 : 1,
      },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new FaviconsWebpackPlugin('./src/images/favicon.svg'),
        new ESLintPlugin({fix: true}),
        new CopyWebpackPlugin({
            patterns: [{from: 'src/images', to:'images'}]
        })
    ],
    performance: {
      maxEntrypointSize: 2.5 * 1000000, // 1MB
      maxAssetSize: 2.1 * 1000000,
    },
    watchOptions: {
      aggregateTimeout: 500,
      poll: 1000,
    },
    devServer: {
      clientLogLevel: 'warning',
      contentBase: path.join(__dirname, './src'),
      contentBasePublicPath: '/',
      filename: '[name].js',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      historyApiFallback: true,
      hot: true,
      inline: true,
      liveReload: true,
      noInfo: false,
      open: true,
      port,
      publicPath,
      quiet: false,
      stats: 'errors-only',
    },
}

if (!production) {
    delete config.output.chunkFilename;
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config;
