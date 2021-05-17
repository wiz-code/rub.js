module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: {
          version: 3,
          proposals: true,
        },
      },
    ],
    '@babel/plugin-proposal-class-properties',
  ],
};
