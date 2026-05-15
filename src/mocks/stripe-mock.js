const StripeMock = {
  StripeProvider: ({ children }) => children,
  useStripe: () => ({
    confirmPayment: () => Promise.resolve({ error: null }),
    createPaymentMethod: () => Promise.resolve({ error: null }),
    // Add other methods as needed
  }),
  useConfirmPayment: () => ({
    confirmPayment: () => Promise.resolve({ error: null }),
    loading: false,
  }),
  usePaymentSheet: () => ({
    initPaymentSheet: () => Promise.resolve({ error: null }),
    presentPaymentSheet: () => Promise.resolve({ error: null }),
    loading: false,
  }),
  // ... mock other exports
};

export const StripeProvider = StripeMock.StripeProvider;
export const useStripe = StripeMock.useStripe;
export const useConfirmPayment = StripeMock.useConfirmPayment;
export const usePaymentSheet = StripeMock.usePaymentSheet;

export default StripeMock;
