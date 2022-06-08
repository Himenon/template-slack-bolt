import path from "path";
import webpack from "webpack";

/**
 * for esm
 */
const __dirname = path.dirname(new URL(import.meta.url).pathname);

process.on("unhandledRejection", console.dir);

/** @type {webpack.Configuration} */
const config = {
  mode: process.env.NODE_ENV !== "development" ? "production" : "development",
  target: "node16.13",
  entry: {
    server: ["regenerator-runtime", "./src/entry.ts"],
  },
  devtool: "inline-source-map",
  experiments: {
    outputModule: true,
  },
  output: {
    path: path.join(__dirname, "dist-server"),
    filename: "[name].mjs",
    library: {
      type: "module",
    },
    clean: true,
  },
  /** 成果物に対する圧縮・難読化の設定 */
  optimization: {
    minimize: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.APP_VERSION": JSON.stringify(process.env.APP_ENV || "dev"),
      "process.env.BUILD": JSON.stringify("webpack"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          // rustで作成されたJavaScript/TypeScriptトランスパイラ（babelよりとても速い）
          // 設定は.swcrcを読む
          loader: "swc-loader",
        },
      },
      // {
      //   test: /\.m?jsx?/,
      //   resolve: {
      //     // package.jsonに`"type": "module"`が指定されていた場合に、importするファイルの拡張子を指定しなければいけない
      //     // 具体的には、`import {} from "./a.js"`や`import {} from "./a.mjs"`といった具合
      //     // これを厳密にnode_modules内でサポートするのは不可能なため切っておく
      //     // @see https://github.com/webpack/webpack/issues/11467#issuecomment-691873586
      //     // @see https://webpack.js.org/configuration/module/#resolvefullyspecified
      //     fullySpecified: false,
      //   },
      // },
    ],
  },
  resolve: {
    extensions: [".web.mjs", ".mjs", ".web.js", ".js", ".web.ts", ".ts", ".web.tsx", ".tsx", ".json", ".web.jsx", ".jsx"],
    modules: [path.join(__dirname, "src"), "node_modules", path.join(__dirname, "node_modules")],
  },
  externalsPresets: { node: true },
  // externals: [nodeExternals()],
};

export default config;
