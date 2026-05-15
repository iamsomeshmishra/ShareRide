import * as RNWeb from 'react-native-web';

// Mock NativeModules
export const NativeModules = {
  ...(RNWeb.NativeModules || {}),
  StripeModule: {
    getConstants: () => ({}),
  },
  RNCNetInfo: {
    getCurrentState: () => Promise.resolve({ isConnected: true }),
    addListener: () => {},
    removeListeners: () => {},
  },
};

// Mock UIManager
export const UIManager = {
  ...(RNWeb.UIManager || {}),
  hasViewManagerConfig: (name) => false,
  getViewManagerConfig: (name) => null,
  dispatchViewManagerCommand: () => {},
  measure: () => {},
  measureInWindow: () => {},
  measureLayout: () => {},
  updateView: () => {},
  focus: () => {},
  blur: () => {},
};

// Other RN internal mocks
export const codegenNativeCommands = () => ({});
export const codegenNativeComponent = (name) => name;
export const ReactNativePrivateInterface = { UIManager };
export const AssetSourceResolver = {};
export const PlatformColor = (color) => color;
export const DynamicColorIOS = (colors) => colors.light;
export const NativeEventEmitter = class {
  addListener() { return { remove: () => {} }; }
  removeListeners() { }
};

// Re-export everything from react-native-web
export * from 'react-native-web';

// Default export should be the merged object
const ExportObject = {
  ...RNWeb,
  NativeModules,
  UIManager,
  codegenNativeCommands,
  codegenNativeComponent,
  ReactNativePrivateInterface,
  AssetSourceResolver,
  PlatformColor,
  DynamicColorIOS,
  NativeEventEmitter,
};

export default ExportObject;
