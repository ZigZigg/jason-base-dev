const withLess = require("next-with-less");

/** @type {import('next').NextConfig} */
const nextConfig = withLess({
  lessLoaderOptions: {
    lessOptions: {
      modifyVars: {
        "primary-color": "#1890ff", // Customize primary color
        "border-radius-base": "4px", // Customize border radius
      },
    },
  },
  images: {
    domains: ["img.freepik.com", "codetheweb.blog", "assets.jason.org", "i.pinimg.com", "assetsdev.jason.org"], // Allow external images from Freepik
  },
});

module.exports = nextConfig;
