import { Linking } from 'react-native';

// Sanitize phone number: strip everything except digits and +
const sanitizePhone = (phone: string): string => phone.replace(/[^\d+]/g, '');

const validatePhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

export const sendSMS = async (phoneNumber: string, message: string) => {
  if (!validatePhone(phoneNumber)) {
    throw new Error('Invalid phone number');
  }
  try {
    const cleaned = sanitizePhone(phoneNumber);
    const url = `sms:${cleaned}${getSMSSeparator()}body=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

export const sendGroupSMS = async (phoneNumbers: string[], message: string) => {
  try {
    const recipients = phoneNumbers.join(',');
    const url = `sms:${recipients}${getSMSSeparator()}body=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error sending group SMS:', error);
    throw error;
  }
};

export const makePhoneCall = async (phoneNumber: string) => {
  if (!validatePhone(phoneNumber)) {
    throw new Error('Invalid phone number');
  }
  try {
    const cleaned = sanitizePhone(phoneNumber);
    const url = `tel:${cleaned}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error making phone call:', error);
    throw error;
  }
};

export const sendEmail = async (
  email: string,
  subject?: string,
  body?: string
) => {
  try {
    let url = `mailto:${email}`;
    const params: string[] = [];
    
    if (subject) {
      params.push(`subject=${encodeURIComponent(subject)}`);
    }
    
    if (body) {
      params.push(`body=${encodeURIComponent(body)}`);
    }
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendReviewRequest = async (
  phoneNumber: string,
  customerName: string,
  businessName: string,
  reviewLink: string
) => {
  const message = `Hi ${customerName}! Thank you for choosing ${businessName}. We'd love to hear your feedback! Please leave us a review: ${reviewLink}`;
  return sendSMS(phoneNumber, message);
};

// Helper function to get SMS separator based on platform
const getSMSSeparator = () => {
  return '?'; // Works for both iOS and Android
};
