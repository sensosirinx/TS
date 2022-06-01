const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')

let distFolder = 'dist/'

const plugins = [
  new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[id].css",
  }),
  new HtmlWebpackPlugin({
    dist: distFolder,
    inject: 'body',
    template: path.resolve(__dirname, './src/index.html')
  }),
  new CopyWebpackPlugin([
      {
        from: 'src/assets',
        to: 'assets'
      }
    ]),
];

module.exports = {
  mode: 'development',
  stats: {
    errorDetails: true,
  },
  entry: {
    "main": __dirname + "/src/main.tsx",
  },
  devtool: 'inline-source-map',
  output: {
    path: __dirname + '/dist',
    filename: 'main.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            dependency: { not: ['url'] },
            use: ['@svgr/webpack', 'new-url-loader'],
          },
          {
            type: 'asset',
          },
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.jsx', '.tsx', '.ts', '.js'],
  },
  plugins,
  devServer: {
    static: './src/',
    port: 4000,
  }
};
