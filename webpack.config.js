const path = require("path")

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "ppc.min.js",
    library: "PPC",
    libraryTarget: "var"
  },
  resolve: {
    fallback: {
      buffer: require.resolve("buffer/")
    }
  },
  mode: "production",
  optimization: {
    minimize: true
  }
}
