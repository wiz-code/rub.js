module.exports = {
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: 'maintained node versions',
            modules: 'commonjs',
            useBuiltIns: 'usage',
            corejs: {
              version: 3.6,
              proposals: true,
            },
            shippedProposals: true,
          },
        ],
        '@babel/preset-typescript',
      ],
      plugins: [],
    }
  },
};
