const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Only mock specific native-only libraries that don't have web support
// Leave 'react-native' resolution to Expo's default, which handles web aliasing correctly.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native-maps': path.resolve(__dirname, 'src/mocks/maps-mock.js'),
  '@stripe/stripe-react-native': path.resolve(__dirname, 'src/mocks/stripe-mock.js'),
  'lottie-react-native': path.resolve(__dirname, 'src/mocks/lottie-mock.js'),
};

module.exports = config;
