const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
    library: 'Rub',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: /(node_modules|dist)/,
        loader: 'eslint-loader',
        options: {
          fix: true,
        },
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
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

  plugins: [
    new CleanWebpackPlugin(),
  ],

  resolve: {
    alias: {
      Src: path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts'],
  },
};
