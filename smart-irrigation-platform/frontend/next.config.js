const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  outputFileTracingRoot: path.join(__dirname),
};

module.exports = nextConfig;
