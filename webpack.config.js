module.exports = function () {
  return {
    name: "devserver-overlay-config",
    configureWebpack(_config, isServer) {
      if (isServer) return;

      return {
        devServer: {
          client: {
            overlay: {
              errors: true,
              warnings: false,
              runtimeErrors: false,
            },
          },
        },
      };
    },
  };
};
