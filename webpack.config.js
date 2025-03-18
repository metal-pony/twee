// Reference: https://webpack.js.org/configuration/

import path from 'path';

/** @type {import('webpack').Configuration} */
export default {
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
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: ['node_modules']
  },

  devtool: 'inline-source-map',
  watchOptions: {
    ignored: /node_modules/,
  },
};
