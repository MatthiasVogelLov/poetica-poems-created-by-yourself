
import { Resend } from "https://esm.sh/resend@2.0.0";
import { config } from "./config.ts";
import { formatKeywordsHtml, formatEditorPreferencesHtml, getPoemStyle } from "./email-formatter.ts";

/**
 * Prepare and send poem notification email
 */
export async function sendPoemNotification(
  poemTitle: string,
  poemContent: string,
  formData: any,
  editorPreferences: any,
  formattedPoemContent: string
): Promise<any> {
  if (!config.resendApiKey) {
    console.error('[notify-poem] ERROR: Resend API key is not configured');
    throw new Error('Resend API key is not configured');
  }

  console.log('[notify-poem] Resend API key found, length:', config.resendApiKey.length);
  const resend = new Resend(config.resendApiKey);
  
  // Format the form data for the email
  const formDataList = Object.entries(formData || {})
    .filter(([key]) => key !== 'poem') // Exclude the poem content from the list
    .map(([key, value]) => {
      // Format the key for better readability
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      return `<li><strong>${formattedKey}:</strong> ${value}</li>`;
    })
    .join('');

  console.log('[notify-poem] Formatted form data for email');

  // Extract keywords if available
  const keywords = formData?.keywords || '';
  const keywordsHtml = formatKeywordsHtml(keywords);
  
  // Format editor preferences for display
  const formattingHtml = formatEditorPreferencesHtml(editorPreferences);
  
  // Apply styling based on preferences
  const poemStyle = getPoemStyle(editorPreferences);

  console.log('[notify-poem] About to send email to:', config.recipientEmail);

  // Send email notification
  const emailPayload = {
    from: 'Poetica <notification@poetica.apvora.com>',
    to: config.recipientEmail,
    subject: `Neues Gedicht: ${poemTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1d3557; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Neues Gedicht erstellt: ${poemTitle}</h1>
        
        <div style="margin: 20px 0; padding: 10px; background-color: #e8f4ff; border-radius: 5px;">
          <p><strong>Empfänger:</strong> ${config.recipientEmail}</p>
          <p><strong>Gesendet am:</strong> ${new Date().toLocaleString('de-DE')}</p>
          <p><strong>Formatierungseinstellungen:</strong> ${formattingHtml}</p>
        </div>
        
        <h2 style="color: #457b9d; margin-top: 20px;">Gedicht</h2>
        <div style="${poemStyle}">
          ${formattedPoemContent || 'Kein Gedichttext verfügbar'}
        </div>
        
        ${keywordsHtml}
        
        <h2 style="color: #457b9d; margin-top: 20px;">Gewählte Einstellungen</h2>
        <ul style="line-height: 1.6;">
          ${formDataList || '<li>Keine Einstellungen verfügbar</li>'}
        </ul>
        
        <p style="margin-top: 30px; color: #6c757d; font-size: 14px; border-top: 1px solid #ddd; padding-top: 10px;">
          Diese E-Mail wurde automatisch von der Poetica App gesendet am ${new Date().toLocaleString('de-DE')}.
        </p>
      </div>
    `
  };

  console.log('[notify-poem] Email payload prepared, content length:', emailPayload.html.length);

  try {
    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      console.error('[notify-poem] Error from Resend API:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('[notify-poem] Email notification sent successfully:', data);
    return data;
  } catch (sendError) {
    console.error('[notify-poem] Exception while calling Resend API:', sendError);
    throw new Error(`Exception calling Resend API: ${sendError.message}`);
  }
}
