// src/plugins/pdf-export-plugin.js
module.exports = function (context, options) {
  return {
    name: "pdf-export-plugin",
    getClientModules() {
      return [require.resolve("../components/PdfExportWrapper/client")];
    },
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: "link",
            attributes: {
              rel: "preconnect",
              href: "https://cdnjs.cloudflare.com",
            },
          },
        ],
      };
    },
  };
};
