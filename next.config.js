/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'oaidalleapiprodscus.blob.core.windows.net', 
      'cdn.openai.com',
      'openaiapi-site.azureedge.net',
      'openaicom-api-bdcpf8c6d2e9atf6.z01.azurefd.net',
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.openai.com',
      },
      {
        protocol: 'https',
        hostname: '**.oaiusercontent.com',
      }
    ]
  }
}

module.exports = nextConfig