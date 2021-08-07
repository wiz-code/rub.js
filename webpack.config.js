const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',

  watch: false,

  devtool: 'source-map',

  entry: {
    rub: 'Src/index.ts',
    'rub.min': "Src/index.ts",
  },

  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    library: {
      name: 'Rub',
      type: 'umd',
    },
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'babel-loader',
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.min\.js(\?.*)?$/i,
      }),
    ],
  },

  plugins: [],

  resolve: {
    alias: {
      Src: path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts'],
  },

  devServer: {
    contentBase: [
      path.resolve(__dirname, './lib'),
      path.resolve(__dirname, './test'),
    ],
    host: '127.0.0.1',
    port: 3000,
    //hot: true,
    //open: true,
  },
};
