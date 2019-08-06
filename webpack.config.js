const src = __dirname + '/src';
const dist = __dirname + '/dist';

//var webpack = require('webpack');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
//const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  context: src,
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: "./js/index.js",

  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: dist,
    // 出力ファイル名
    filename: "main.js"
  },

  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: "development",

  // ローカル開発用環境を立ち上げる
  // 実行時にブラウザが自動的に localhost を開く
  devServer: {
    //contentBase: "dist",
    contentBase: "./",
    open: true
  },

  module: {
    rules: [{
      test: /\.js?$/, // 拡張子がjsで
      exclude: /node_modules/, // node_modulesフォルダ配下は除外
      loader: 'babel-loader', // babel-loaderを使って変換する
      query: {
        plugins: ["transform-react-jsx"] // babelのtransform-react-jsxプラグインを使ってjsxを変換
      }
    }]
  }
  //module: {
  //  loaders: [
  //    {
  //      test: /\.js$/,
  //      exclude:/node_modules/,
  //      loader: "babel-loader",
  //      query: {
  //        presets:[
  //          ["env", {
  //            "targets": {
  //              "node": "current"
  //            }
  //          }]
  //        ]
  //      }
  //    },
  //    {
  //      test: /\.html$/,
  //      loader: "html-loader"
  //    }
  //  ]
  //},
  //plugins: [
  //  new UglifyJSPlugin(),
  //  new HtmlWebpackPlugin({
  //    template: "./html/index.html"
  //  })
  //]
};
