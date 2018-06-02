module.exports = {
    entry: {
      top: __dirname + "/src/top.tsx",
      dashboard: __dirname + "/src/dashboard.tsx",
      visit: __dirname + "/src/visit.tsx"
    },
    output: {
      path: __dirname + "/dist/assets",
      publicPath: "/assets",
      filename: "[name].bundle.js"
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
