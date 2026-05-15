module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "react-native-maps": "./src/mocks/maps-mock",
            "@stripe/stripe-react-native": "./src/mocks/stripe-mock",
            "lottie-react-native": "./src/mocks/lottie-mock",
            "react-native-vector-icons/MaterialCommunityIcons": "./src/mocks/web-native-shim",
            "react-native-vector-icons/MaterialIcons": "./src/mocks/web-native-shim",
            "react-native-vector-icons/FontAwesome": "./src/mocks/web-native-shim",
            "react-native-vector-icons/Feather": "./src/mocks/web-native-shim",
            "react-native-vector-icons/Ionicons": "./src/mocks/web-native-shim",
            "react-native-vector-icons/Entypo": "./src/mocks/web-native-shim"
          }
        }
      ]
    ]
  };
};
