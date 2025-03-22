
import { Resend } from "https://esm.sh/resend@2.0.0";
import { formatPoemForEmail } from "../_shared/email-utils.ts";

/**
 * Send email notification with poem details
 */
export async function sendEmailNotification(
  formData: any, 
  poemTitle: string, 
  resendApiKey: string | undefined, 
  recipientEmail: string
) {
  if (!formData || !resendApiKey) {
    console.log('[create-paypal-checkout] Skipping email notification - missing data or API key');
    return;
  }
  
  try {
    console.log('[create-paypal-checkout] Attempting to send email notification');
    
    const resend = new Resend(resendApiKey);
    
    // Extract minimal form data
    const minimalFormData = {
      audience: formData.audience || '',
      occasion: formData.occasion || '',
      contentType: formData.contentType || '',
      style: formData.style || '',
      length: formData.length || '',
      keywords: formData.keywords || ''
    };
    
    // Format the form data for the email
    const formDataList = Object.entries(minimalFormData)
      .filter(([key]) => key !== 'poem')
      .map(([key, value]) => {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        return `<li><strong>${formattedKey}:</strong> ${value}</li>`;
      })
      .join('');

    // Format poem content for email
    const formattedPoemContent = formData.poem ? formatPoemForEmail(formData.poem) : '<p>Kein Gedichttext verfügbar</p>';

    const emailPayload = {
      from: 'Poetica <notification@poetica.apvora.com>',
      to: recipientEmail,
      subject: `Neues Gedicht: ${poemTitle} (PayPal Checkout)`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1d3557; border-bottom: 1px solid #ddd; padding-bottom: 10px;">${poemTitle}</h1>
          
          <h2 style="color: #457b9d; margin-top: 20px;">Gedicht</h2>
          <div style="white-space: pre-line; font-family: 'Playfair Display', serif; background-color: #f8f9fa; padding: 20px; border-radius: 5px; line-height: 1.6;">
            ${formattedPoemContent}
          </div>
          
          <h2 style="color: #457b9d; margin-top: 20px;">Gewählte Einstellungen</h2>
          <ul style="line-height: 1.6;">
            ${formDataList || '<li>Keine Einstellungen verfügbar</li>'}
          </ul>
          
          <p style="margin-top: 30px; color: #6c757d; font-size: 14px; border-top: 1px solid #ddd; padding-top: 10px;">
            Diese E-Mail wurde automatisch von der Poetica App gesendet (PayPal Checkout).
          </p>
        </div>
      `
    };

    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      console.error('[create-paypal-checkout] Error sending email via Resend:', error);
    } else {
      console.log('[create-paypal-checkout] Email notification sent successfully via Resend:', data);
    }
  } catch (emailError) {
    console.error('[create-paypal-checkout] Error sending notification:', emailError);
    // Don't throw, allow checkout to continue
  }
}
