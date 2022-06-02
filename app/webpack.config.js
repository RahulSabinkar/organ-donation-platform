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
    new CopyWebpackPlugin([{ from: "./src/html/homepage.html", to: "homepage.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/donor-registration.html", to: "donor-registration.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/patient-registration.html", to: "patient-registration.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/view-donors.html", to: "view-donors.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/view-patients.html", to: "view-patients.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/transplant-matching.html", to: "transplant-matching.html" }]),
    new CopyWebpackPlugin([{ from: "./src/css/bootstrap.css", to: "css/bootstrap.css" }]),
    new CopyWebpackPlugin([{ from: "./src/css/bootstrap-home.css", to: "bootstrap-home.css" }]),
    new CopyWebpackPlugin([{ from: "./src/css/styles.css", to: "css/styles.css" }]),
    new CopyWebpackPlugin([{ from: "./src/css/style-home.css", to: "css/style-home.css" }]),
    new CopyWebpackPlugin([{ from: "./src/css/fontawesome-all.css", to: "css/fontawesome-all.css" }]),
    new CopyWebpackPlugin([{ from: "./src/images/organ-donation-logo.svg", to: "images/organ-donation-logo.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/organ-donation-logo-new.svg", to: "images/organ-donation-logo-new.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/logo-new-final.svg", to: "images/logo-new-final.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/logo-final-1.svg", to: "images/logo-final-1.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/logo-final-2.svg", to: "images/logo-final-2.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/home-slider-image.jpg", to: "images/home-slider-image.jpg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/home-slider-image-1.jpg", to: "images/home-slider-image-1.jpg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/home-slider-image-2.jpg", to: "images/home-slider-image-2.jpg" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};