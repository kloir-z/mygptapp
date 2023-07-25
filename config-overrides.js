module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: require.resolve('babel-loader'),
      options: {
        plugins: [
          require.resolve('@emotion/babel-plugin'),
        ],
      },
    },
  });

  return config;
};