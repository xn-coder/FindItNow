
import emailjs from '@emailjs/browser';
import { templateContents, type TemplateId } from './email-templates';


const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const EMAILJS_ENABLED = process.env.NEXT_PUBLIC_EMAILJS_ENABLED !== 'false';

if (EMAILJS_ENABLED && (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY)) {
  console.warn(
    'EmailJS is enabled, but environment variables are not fully set. Email functionality will be disabled.'
  );
}

export type EmailTemplateParams = {
  to_email: string;
  templateId: TemplateId;
  variables: Record<string, string>;
};

const compileTemplate = (templateString: string, variables: Record<string, string>) => {
    return templateString.replace(/\{\{(\w+)\}\}/g, (placeholder, key) => {
        return variables[key] || placeholder;
    });
};

export const sendEmail = async ({ to_email, templateId, variables }: EmailTemplateParams): Promise<void> => {
  const template = templateContents[templateId];

  if (!template) {
    console.error(`Email template with ID "${templateId}" not found.`);
    throw new Error(`Email template with ID "${templateId}" not found.`);
  }

  const subject = compileTemplate(template.subject, variables);
  const message = compileTemplate(template.message, variables);

  const finalParams = {
    to_email,
    subject,
    message,
    ...variables, // Pass all variables to the EmailJS template as well
  };

  if (!EMAILJS_ENABLED) {
    console.log('Email sending is disabled. Skipping email send.');
    // Log the email content for debugging purposes during development
    console.log('Email content:', finalParams);
    return;
  }
  
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.error('Cannot send email: EmailJS credentials are not configured in .env');
    throw new Error("EmailJS credentials are not configured.");
  }
  
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, finalParams as any, PUBLIC_KEY);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Failed to send email:', error);
    // Re-throw the error to be handled by the calling function
    throw new Error('Failed to send email.');
  }
};
