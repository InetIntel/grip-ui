const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const env = dotenv.config({ path: path.resolve(__dirname, '.env') }).parsed || {};

const BASE_URL = env.BASE_URL || process.env.BASE_URL;
const APP_BASENAME = env.APP_BASENAME || process.env.APP_BASENAME || '/';

const envKeys = {
  'process.env.BASE_URL': JSON.stringify(BASE_URL),
  'process.env.APP_BASENAME': JSON.stringify(APP_BASENAME),
};

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: APP_BASENAME.endsWith('/') ? APP_BASENAME : APP_BASENAME + '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          'style-loader', // Injects styles into the DOM
          'css-loader',   // Translates CSS into CommonJS
          'sass-loader'   // Compiles Sass to CSS
        ]
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader', // Injects styles into the DOM
          'css-loader'    // Translates CSS into CommonJS
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.DefinePlugin(envKeys)
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    compress: true,
    port: 1234,
    allowedHosts:"all",
    historyApiFallback: true
  },
  mode: 'production'
};
