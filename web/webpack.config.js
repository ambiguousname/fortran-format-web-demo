const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    'main': path.resolve(__dirname, './src/js/index.js'),
    'style': path.resolve(__dirname, './src/scss/main.scss'),
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader', // translates CSS into CommonJS modules
        }, {
          loader: 'postcss-loader', // Run post css actions
          options: {
            postcssOptions: {
              plugins: function () { // post css plugins, can be exported to postcss.config.js
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          }
        }, {
          loader: 'sass-loader' // compiles Sass to CSS
        }]
      },
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
	alias: {
		Formatter: path.resolve(__dirname, "../build/src/format_bindings")
	},
  fallback: {"path": require.resolve("path-browserify")}
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../build/src/format_bindings/out.wasm"),
          to: "."
        },
        {
          from: path.resolve(__dirname, "../LICENSE"),
          to: "./licenses/Main.txt"
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    }
  }
};