module.exports = function () {
  return {
    name: "disable-webpack-overlay",
    configureWebpack(config, isServer) {
      if (!isServer) {
        // Add webpack configuration to handle React Native modules
        config.resolve = config.resolve || {};
        config.resolve.alias = config.resolve.alias || {};
        config.resolve.alias['@react-native-async-storage/async-storage'] = false;
        config.resolve.alias['react-native'] = false;

        return {
          devServer: {
            client: {
              overlay: false,
            },
          },
        };
      }
    },
  };
};
