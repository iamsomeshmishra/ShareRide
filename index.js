import { registerRootComponent } from 'expo';
import { Platform, UIManager, NativeModules } from 'react-native';
import App from './src/App';

// Polyfill for native-only APIs that crash on web
if (Platform.OS === 'web') {
  // Ensure UIManager has expected methods for native-focused libraries
  const uiManager = UIManager || {};
  if (!uiManager.hasViewManagerConfig) {
    uiManager.hasViewManagerConfig = (name) => false;
  }
  if (!uiManager.getViewManagerConfig) {
    uiManager.getViewManagerConfig = (name) => null;
  }
  
  // Ensure NativeModules is not undefined and has common stubs
  if (typeof NativeModules === 'undefined' || !NativeModules) {
    global.NativeModules = {};
  }

  // Stripe requires specific constants on some versions
  if (!NativeModules.StripeModule) {
    NativeModules.StripeModule = {
      getConstants: () => ({}),
    };
  }
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
registerRootComponent(App);

