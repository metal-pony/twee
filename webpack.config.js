// Reference: https://webpack.js.org/configuration/

import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

/** @type {import('webpack').Configuration} */
export default {
  mode: 'development',

  entry: './src/index.js',

  output: {
    filename: 'main.js',
    path: path.resolve('./dist'),
    publicPath: '/'
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
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
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
  ],

  devtool: 'inline-source-map',
  devServer: {
    static: {
     directory: 'dist'
    },
    port: 3047
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
