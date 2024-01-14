var path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'index.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main.js'
    },
    mode: 'production',
        plugins: [
            new MiniCssExtractPlugin(), 
            new ESLintPlugin({fix: true})
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                },
            ]
        },
        optimization: {
            minimizer: [
                '...',
                new CssMinimizerPlugin(),
            ],
        }
    }