import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
  console.warn(
    'EmailJS environment variables are not set. Email functionality will be disabled.'
  );
}

export type EmailTemplateParams = {
  to_email: string;
  subject: string;
  message: string;
  [key: string]: string; // Allow other string properties
};

export const sendEmail = async (templateParams: EmailTemplateParams): Promise<void> => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.error('Cannot send email: EmailJS credentials are not configured in .env');
    // Silently fail in production if not configured
    return;
  }
  
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
        publicKey: PUBLIC_KEY,
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Failed to send email:', error);
    // You might want to throw the error or handle it differently
    throw new Error('Failed to send email.');
  }
};
