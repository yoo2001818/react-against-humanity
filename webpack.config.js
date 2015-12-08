var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var entries = ['./src/client.js'];
var plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: process.env.NODE_ENV !== 'production',
    __DEVTOOLS__: false
  }),
  new ExtractTextPlugin('bundle.css', {
    disable: process.env.NODE_ENV !== 'production'
  })
];
if (process.env.NODE_ENV !== 'production') {
  entries.push('webpack-hot-middleware/client?overlay=true');
  plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
  // devtool: 'eval-source-map',
  context: __dirname,
  entry: entries,
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
    chunkFilename: '[id].js'
  },
  plugins: plugins,
  node: {
    fs: 'empty'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/i,
        exclude: /(node_modules|bower_components)/,
        // Put 'react-hot' if needed
        loaders: ['react-hot', 'babel']
      },
      {
        test: /\.json$/i,
        loader: 'json'
      },
      {
        test: /\.html?$/i,
        loader: 'html'
      },
      {
        test: /\.css$/i,
        loader: ExtractTextPlugin.extract('style', 'css')
      },
      {
        test: /\.s[ca]ss$/i,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/,
        loader: 'url-loader?limit=10240'
      }
    ]
  }
};
