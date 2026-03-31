import nextPWA from 'next-pwa';

const runtimeCaching = [
  {
    urlPattern: /^https:\/\/.*\/home$/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'home-page',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 24 * 60 * 60, // 1 día
      },
    },
  },
  {
    urlPattern: /\.(?:js|css|woff2|png|jpg|jpeg|svg|gif)$/,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-resources',
    },
  },
];

let withPWA = (config) => config;

if (process.env.NODE_ENV !== 'development') {
  const nextPWA = (await import('next-pwa')).default;
  withPWA = nextPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: false,
    mode: 'production',
    runtimeCaching
  });
}

const nextConfig = {
  reactStrictMode: true
};

export default nextConfig //TODO: Luego hay que ver como poner el PWA aca
