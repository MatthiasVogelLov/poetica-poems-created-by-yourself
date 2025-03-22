
/**
 * The supported payment providers
 */
export type PaymentProvider = 'stripe' | 'paypal' | null;

/**
 * Props for the usePaymentProcess hook
 */
export interface UsePaymentProcessProps {
  isLoading: boolean;
  error: string | null;
  handlePaymentClick: (provider: PaymentProvider) => Promise<void>;
  checkPayPalReturn: () => Promise<void>;
  paymentProvider: PaymentProvider;
  paypalOrderId: string | null;
}
