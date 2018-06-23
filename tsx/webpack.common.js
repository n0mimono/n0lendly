module.exports = {
    entry: __dirname + "/src/index.tsx",
    output: {
      path: __dirname + "/dist/assets",
      publicPath: "/assets",
      filename: "bundle.js"
    },
    module: {
      rules: [
          {
              test: /\.tsx?$/,
              loader: 'awesome-typescript-loader'
          },
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
  }
