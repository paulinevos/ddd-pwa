module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@/theme': './theme/index.ts', // Direct alias to the theme file
            '@/theme/*': './theme/*',     // Alias for anything else in the theme folder
            // You can add other aliases here, e.g.:
            // '@/components': './components',
            // '@/utils': './utils',
            // '@/assets': './assets',
            // '@/screens': './app' // if your screens are in 'app'
          },
        },
      ],
    ],
  };
};
