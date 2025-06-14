const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

const API_ORIGIN = process.env.API_ORIGIN || '';

const devServerPort = 3000;
const publicPath = '/dist/';

const config = {
    entry: './src/app/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'esbuild-loader',
                options: {loader: 'jsx'}
            },
            {
                test: /\.d\.ts$/,
                loader: 'ignore-loader'
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules|\.d\.ts$/,
                use: 'ts-loader'
            },
            {
                test: /\.s?css$/,
                use: [
                    'style-loader',
                    'fast-css-loader',
                    {
                        loader: 'fast-sass-loader',
                        options: {
                            implementation: require('node-sass'),
                            includePaths: ['./src/styles', './node_modules']
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(
                            /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                        )[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`;
                    }
                }
            }
        }
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{from: 'src/images', to: 'images'}]
        }),
        new webpack.EnvironmentPlugin({API_ORIGIN}),
        new ESLintPlugin({fix: true}),
        new FaviconsWebpackPlugin('./src/images/favicon.svg'),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new StylelintPlugin({
            files: './src/**/*.scss'
        })
    ],
    performance: {
        maxEntrypointSize: 2.5 * 1000000, // 1MB
        maxAssetSize: 2.1 * 1000000
    },
    resolve: {
        alias: {
            react: 'preact/compat',
            'react-dom/test-utils': 'preact/test-utils',
            'react-dom': 'preact/compat',
            'react/jsx-runtime': 'preact/jsx-runtime',
            '~': path.resolve(__dirname, 'src/app')
        },
        modules: [path.resolve(__dirname, 'src/app'), 'node_modules'],
        extensions: ['.js', '.jsx', '.tsx', '.ts']
    },
    watchOptions: {
        aggregateTimeout: 500,
        poll: 1000
    },
    devServer: {
        client: {
            logging: 'warn'
        },
        devMiddleware: {
            index: false,
            publicPath,
            stats: 'errors-only'
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':
                'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers':
                'X-Requested-With, content-type, Authorization'
        },
        historyApiFallback: {index: `${publicPath}/index.html`},
        hot: true,
        liveReload: true,
        open: true,
        port: devServerPort,
        // fonts are always loaded with CORS but the CMS doesn't set CORS headers for them
        // to get around this, we proxy them instead
        proxy: [{
            context: (p) => p.startsWith('/cms/assets/fonts'),
            target: API_ORIGIN,
            changeOrigin: true
        }],
        static: {
            directory: path.resolve(__dirname, './src'),
            publicPath
        }
    }
};

module.exports = (env, argv) => {
    config.mode = argv.mode || 'development';
    console.log('Building', config.mode);

    if (config.mode === 'production') {
        config.output.filename = '[name]-[contenthash].min.js';
        config.devtool = 'source-map';
        config.optimization.splitChunks.maxInitialRequests = 5;
        config.output.chunkFilename = 'chunk-[chunkhash].js';
    } else {
        config.output.filename = '[name].js';
        config.devtool = 'inline-source-map';
        config.optimization.splitChunks.maxInitialRequests = 1;
    }

    return config;
};
