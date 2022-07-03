const path = require('path');

module.exports = {
  entry: './src/js/index.js',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'src/dist'),
  },
};
