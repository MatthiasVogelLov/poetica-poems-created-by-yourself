
/**
 * Service for sending the daily statistics email
 */
import { Resend } from "https://esm.sh/resend@2.0.0";

/**
 * Sends the daily statistics email using Resend
 */
export async function sendDailyStatsEmail(
  resendApiKey: string,
  recipientEmail: string,
  subject: string,
  htmlContent: string
) {
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is not set');
  }
  
  const resend = new Resend(resendApiKey);
  
  try {
    const emailData = await resend.emails.send({
      from: "Poetica <poem@poetica.apvora.com>",  // Using verified domain
      to: [recipientEmail],
      subject: subject,
      html: htmlContent,
    });
    
    console.log('[daily-stats-email] Email sent response:', JSON.stringify(emailData));
    
    if (!emailData || emailData.error) {
      console.error('[daily-stats-email] Error response from Resend:', emailData?.error);
      throw new Error(`Failed to send email: ${emailData?.error || 'Unknown error'}`);
    }
    
    console.log('[daily-stats-email] Stats email sent successfully:', emailData?.id);
    
    return { success: true, data: emailData };
  } catch (emailError) {
    console.error('[daily-stats-email] Exception sending email via Resend:', emailError);
    throw emailError;
  }
}
