// Web Native Shim for libraries that expect native modules
export const codegenNativeCommands = () => ({});
export const codegenNativeComponent = (name) => name;

export const UIManager = {
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

export const NativeModules = {
  StripeModule: {
    getConstants: () => ({}),
  },
  RNCNetInfo: {
    getCurrentState: () => Promise.resolve({ isConnected: true }),
    addListener: () => {},
    removeListeners: () => {},
  },
};

export const ReactNativePrivateInterface = {
  UIManager,
};

export const AssetSourceResolver = {};
export const PlatformColor = (color) => color;
export const DynamicColorIOS = (colors) => colors.light;
export const NativeEventEmitter = class {
  addListener() { return { remove: () => {} }; }
  removeListeners() { }
};

export default {
  UIManager,
  NativeModules,
  ReactNativePrivateInterface,
  AssetSourceResolver,
  PlatformColor,
  DynamicColorIOS,
  NativeEventEmitter,
};
