import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';

const STRIPE_PUBLISHABLE_KEY = Constants.expoConfig?.extra?.stripePublishableKey || process.env.STRIPE_PUBLISHABLE_KEY;
const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.API_URL;

export const createPaymentIntent = async (amount: number, customerId: string) => {
  try {
    const response = await fetch(`${API_URL}/createPaymentIntent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        customerId,
      }),
    });

    const { paymentIntent, ephemeralKey, customer } = await response.json();
    return { paymentIntent, ephemeralKey, customer };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const initializePaymentSheet = async (
  paymentIntent: string,
  ephemeralKey: string,
  customer: string
) => {
  try {
    const { error } = await initPaymentSheet({
      merchantDisplayName: 'B.CLEAN',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Customer Name',
      },
    });

    if (error) {
      console.error('Error initializing payment sheet:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error initializing payment sheet:', error);
    return false;
  }
};

export const processPayment = async () => {
  try {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.error('Payment error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Payment processing error:', error);
    return { success: false, error: 'Payment failed' };
  }
};

export const generateInvoice = async (jobId: string, invoiceData: any) => {
  try {
    const response = await fetch(`${API_URL}/generateInvoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId,
        ...invoiceData,
      }),
    });

    const { invoiceUrl } = await response.json();
    return invoiceUrl;
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
};
