// Reference: https://webpack.js.org/configuration/

import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/** @type {import('webpack').Configuration} */
export default {
  mode: 'production',

  entry: './src/index.js',

  output: {
    filename: 'main.js',
    path: path.resolve('./docs'),
    publicPath: '/',
    clean: true
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss'],
    modules: ['node_modules']
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        path.resolve('./public')
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    })
  ],
  devtool: 'source-map'
};
