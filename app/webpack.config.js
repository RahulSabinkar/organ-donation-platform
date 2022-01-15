const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: "./src/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/donor-registration.html", to: "donor-registration.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/patient-registration.html", to: "patient-registration.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/view-donors.html", to: "view-donors.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/view-patients.html", to: "view-patients.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/transplant-matching.html", to: "transplant-matching.html" }]),
    new CopyWebpackPlugin([{ from: "./src/css/bootstrap.css", to: "css/bootstrap.css" }]),
    new CopyWebpackPlugin([{ from: "./src/css/styles.css", to: "css/styles.css" }]),
    new CopyWebpackPlugin([{ from: "./src/css/fontawesome-all.css", to: "css/fontawesome-all.css" }]),
    new CopyWebpackPlugin([{ from: "./src/images/organ-donation-logo.svg", to: "images/organ-donation-logo.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/organ-donation-logo-new.svg", to: "images/organ-donation-logo-new.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/logo-new-final.svg", to: "images/logo-new-final.svg" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};