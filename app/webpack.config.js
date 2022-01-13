const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/donor-registration.html", to: "donor-registration.html" }]),
    new CopyWebpackPlugin([{ from: "./src/patient-registration.html", to: "patient-registration.html" }]),
    new CopyWebpackPlugin([{ from: "./src/css/bootstrap.css", to: "css/bootstrap.css" }]),
    new CopyWebpackPlugin([{ from: "./src/css/styles.css", to: "css/styles.css" }]),
    new CopyWebpackPlugin([{ from: "./src/css/fontawesome-all.css", to: "css/fontawesome-all.css" }]),
    new CopyWebpackPlugin([{ from: "./src/images/organ-donation.jpg", to: "images/organ-donation.jpg" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
