// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

// module.exports = getDefaultConfig(__dirname);

module.exports = (() => {

  const config = getDefaultConfig(__dirname, {
    // Enable CSS support.
    isCSSEnabled: true,
  });

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer")
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg", 'mjs', 'cjs']
  };

  return config;
})();

// const { resolver: { sourceExts } } = config;

// config.transformer.babelTransformerPath = require.resolve("./transformer.js");
// config.resolver.sourceExts = [...sourceExts, "css","scss", "sass"];

// module.exports = config;
