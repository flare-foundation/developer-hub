module.exports = function () {
  return {
    name: "disable-webpack-overlay",
    configureWebpack(config, isServer) {
      if (!isServer) {
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
