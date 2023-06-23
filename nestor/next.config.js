/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  env: {
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  },
}