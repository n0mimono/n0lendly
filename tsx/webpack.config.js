module.exports = {
    mode: 'development',
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
    devServer: {
      contentBase: 'dist',
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          secure: false
        }
      }
    }
  }
