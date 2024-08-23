// webpack.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './scripts/footballGame.js',
  output: {
    filename: 'footballGame.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'myLibrary',
      type: 'var',
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
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
  resolve: {
    extensions: ['.js']
  },
  mode: 'development',
  devtool: 'source-map'
};
