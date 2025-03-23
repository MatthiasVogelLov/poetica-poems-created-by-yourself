
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { 
  corsHeaders,
  handleCorsPreflightRequest,
  parseRequestBody,
  createErrorResponse,
  createSuccessResponse,
  formatTextWithLineBreaks,
  formatPoemForEmail
} from "../_shared/email-utils.ts";

const resendApiKey = Deno.env.get('RESEND_API_KEY');
const adminEmail = "matthiasvogel1973@gmail.com"; // Admin email for CC

interface SendPoemRequest {
  recipientEmail: string;
  recipientName?: string;
  poemTitle: string;
  poemContent: string;
  personalMessage?: string;
  editorPreferences?: {
    font: string;
    fontSize: string;
    textColor: string;
    backgroundColor: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  try {
    const startTime = new Date();
    console.log(`[send-poem] Starting execution at ${startTime.toISOString()}`);
    
    // Validate Resend API key
    if (!resendApiKey) {
      console.error('[send-poem] CRITICAL ERROR: Resend API key is not configured');
      return createErrorResponse('Resend API key is not configured on the server', 500);
    }

    console.log(`[send-poem] Resend API key found, length: ${resendApiKey.length}`);
    const resend = new Resend(resendApiKey);
    
    // Parse and validate request body
    const { data, error } = await parseRequestBody<SendPoemRequest>(req);
    if (error) return createErrorResponse(error, 400);
    
    const { recipientEmail, recipientName, poemTitle, poemContent, personalMessage, editorPreferences } = data!;
    
    console.log('[send-poem] Extracted data:', { 
      recipientEmail, 
      recipientNameProvided: !!recipientName,
      poemTitleLength: poemTitle?.length,
      poemContentLength: poemContent?.length,
      hasPersonalMessage: !!personalMessage,
      hasEditorPreferences: !!editorPreferences
    });
    
    // Validate required fields
    if (!recipientEmail) {
      return createErrorResponse('Recipient email address is required', 400);
    }
    
    if (!poemTitle || !poemContent) {
      return createErrorResponse('Poem title and content are required', 400);
    }

    console.log(`[send-poem] Preparing to send email to: ${recipientEmail}, with CC to: ${adminEmail}`);

    // Apply styling based on preferences
    const getFontFamily = (fontValue) => {
      switch (fontValue) {
        case 'sans':
          return 'font-family: Arial, Helvetica, sans-serif;';
        case 'mono':
          return 'font-family: "Courier New", Courier, monospace;';
        case 'cursive':
          return 'font-family: "Brush Script MT", cursive;';
        case 'fantasy':
          return 'font-family: "Copperplate", fantasy;';
        default:
          return 'font-family: Georgia, "Times New Roman", serif;';
      }
    };

    const getFontSize = (sizeValue) => {
      switch (sizeValue) {
        case 'text-lg':
          return 'font-size: 18px;';
        case 'text-xl':
          return 'font-size: 20px;';
        case 'text-2xl':
          return 'font-size: 24px;';
        case 'text-3xl':
          return 'font-size: 30px;';
        default:
          return 'font-size: 16px;';
      }
    };

    const getTextColor = (colorValue) => {
      switch (colorValue) {
        case 'text-gray-700':
          return 'color: #374151;';
        case 'text-blue-700':
          return 'color: #1d4ed8;';
        case 'text-green-700':
          return 'color: #15803d;';
        case 'text-purple-700':
          return 'color: #7e22ce;';
        default:
          return 'color: #000000;';
      }
    };

    const getBackgroundColor = (bgValue) => {
      switch (bgValue) {
        case 'bg-white':
          return 'background-color: #ffffff;';
        case 'bg-blue-50':
          return 'background-color: #eff6ff;';
        case 'bg-green-50':
          return 'background-color: #f0fdf4;';
        case 'bg-purple-50':
          return 'background-color: #faf5ff;';
        default:
          return 'background-color: #f9fafb;'; // gray-50
      }
    };

    // Get readable names for formatting options
    const getReadableFontName = (fontValue) => {
      switch (fontValue) {
        case 'sans': return 'Sans-Serif';
        case 'mono': return 'Monospace';
        case 'cursive': return 'Cursive';
        case 'fantasy': return 'Fantasy';
        default: return 'Serif';
      }
    };

    const getReadableFontSize = (sizeValue) => {
      switch (sizeValue) {
        case 'text-lg': return 'Größer';
        case 'text-xl': return 'Groß';
        case 'text-2xl': return 'Sehr Groß';
        case 'text-3xl': return 'Extra Groß';
        default: return 'Normal';
      }
    };

    const getReadableTextColor = (colorValue) => {
      switch (colorValue) {
        case 'text-gray-700': return 'Dunkelgrau';
        case 'text-blue-700': return 'Blau';
        case 'text-green-700': return 'Grün';
        case 'text-purple-700': return 'Lila';
        default: return 'Schwarz';
      }
    };

    const getReadableBackgroundColor = (bgValue) => {
      switch (bgValue) {
        case 'bg-white': return 'Weiß';
        case 'bg-blue-50': return 'Hellblau';
        case 'bg-green-50': return 'Hellgrün';
        case 'bg-purple-50': return 'Helllila';
        default: return 'Hellgrau';
      }
    };

    // Format editor preferences for display
    let formattingHtml = '<span>Standard</span>';
    if (editorPreferences) {
      formattingHtml = `
        <div style="margin-top: 8px;">
          <div style="display: inline-block; padding: 4px 8px; margin-right: 6px; background-color: #f0f0f0; border-radius: 4px;">
            <strong>Schriftart:</strong> ${getReadableFontName(editorPreferences.font)}
          </div>
          <div style="display: inline-block; padding: 4px 8px; margin-right: 6px; background-color: #f0f0f0; border-radius: 4px;">
            <strong>Größe:</strong> ${getReadableFontSize(editorPreferences.fontSize)}
          </div>
          <div style="display: inline-block; padding: 4px 8px; margin-right: 6px; background-color: #f0f0f0; border-radius: 4px;">
            <strong>Textfarbe:</strong> ${getReadableTextColor(editorPreferences.textColor)}
          </div>
          <div style="display: inline-block; padding: 4px 8px; margin-right: 6px; background-color: #f0f0f0; border-radius: 4px;">
            <strong>Hintergrund:</strong> ${getReadableBackgroundColor(editorPreferences.backgroundColor)}
          </div>
        </div>
      `;
    }

    // Apply styling based on preferences
    let poemStyle = '';
    if (editorPreferences) {
      poemStyle = `
        ${getFontFamily(editorPreferences.font)}
        ${getFontSize(editorPreferences.fontSize)}
        ${getTextColor(editorPreferences.textColor)}
        ${getBackgroundColor(editorPreferences.backgroundColor)}
        line-height: 1.8;
        text-align: center;
        padding: 20px;
        border-radius: 5px;
      `;
    } else {
      poemStyle = `
        font-family: Georgia, "Times New Roman", serif;
        font-size: 16px;
        color: #000000;
        background-color: #f9fafb;
        line-height: 1.8;
        text-align: center;
        padding: 20px;
        border-radius: 5px;
      `;
    }

    // Format poem content for email
    const formattedPoemContent = formatPoemForEmail(poemContent);
    
    // Format personal message if present
    const formattedPersonalMessage = personalMessage 
      ? formatTextWithLineBreaks(personalMessage)
      : null;

    try {
      // Send the main email to the recipient (without CC to ensure delivery)
      const result = await resend.emails.send({
        from: 'Poetica <poem@poetica.apvora.com>',
        to: [recipientEmail],
        subject: `Ihr Gedicht: ${poemTitle}`,
        html: `
          <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: left; margin-bottom: 20px;">
              <h1 style="font-family: serif; font-size: 24px; font-style: italic; margin: 0;">Poetica</h1>
            </div>
            
            ${formattedPersonalMessage ? `
            <div style="margin-bottom: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; border-left: 4px solid #1d3557;">
              <p style="font-style: italic; margin: 0;">${formattedPersonalMessage}</p>
            </div>
            ` : ''}
            
            <h1 style="font-family: 'Playfair Display', serif; text-align: center; color: #1d3557; margin-bottom: 20px;">
              ${poemTitle}
            </h1>
            
            <div style="${poemStyle}">
              ${formattedPoemContent}
            </div>
            
            <p style="text-align: center; font-size: 14px; color: #6c757d; border-top: 1px solid #eaeaea; padding-top: 20px; margin-top: 30px;">
              Erstellt mit <a href="https://poetica.apvora.com" style="color: #1d3557; text-decoration: none;">poetica.apvora.com</a>
            </p>
          </div>
        `,
      });
      
      console.log('[send-poem] Email to recipient sent:', JSON.stringify({
        success: !result.error,
        error: result.error,
        data: result.data
      }));

      // Now, always send a separate copy to admin regardless of the main email status
      const adminResult = await resend.emails.send({
        from: 'Poetica <poem@poetica.apvora.com>',
        to: [adminEmail],
        subject: `[ADMIN COPY] Gedicht gesendet: ${poemTitle}`,
        html: `
          <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: left; margin-bottom: 20px; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
              <h1 style="font-family: serif; font-size: 24px; font-style: italic; margin: 0;">Poetica - Admin Benachrichtigung</h1>
              <p style="margin: 10px 0 0 0;">Ein Gedicht wurde gesendet</p>
            </div>
            
            <div style="margin: 20px 0; padding: 10px; background-color: #e8f4ff; border-radius: 5px;">
              <p><strong>Empfänger:</strong> ${recipientEmail}</p>
              <p><strong>Name:</strong> ${recipientName || 'Nicht angegeben'}</p>
              <p><strong>Gesendet am:</strong> ${new Date().toLocaleString('de-DE')}</p>
              <p><strong>Formatierungseinstellungen:</strong> ${formattingHtml}</p>
            </div>
            
            <h2 style="font-family: 'Playfair Display', serif; color: #1d3557; margin-bottom: 10px; text-align: center;">
              ${poemTitle}
            </h2>
            
            <div style="${poemStyle}">
              ${formattedPoemContent}
            </div>
            
            ${formattedPersonalMessage ? `
            <div style="margin-top: 20px;">
              <h3>Persönliche Nachricht:</h3>
              <div style="padding: 10px; background-color: #f9f9f9; border-radius: 5px; border-left: 4px solid #1d3557;">
                <p style="font-style: italic; margin: 0;">${formattedPersonalMessage}</p>
              </div>
            </div>
            ` : ''}
          </div>
        `,
      });
      
      console.log('[send-poem] Admin copy email sent:', JSON.stringify({
        success: !adminResult.error,
        error: adminResult.error,
        data: adminResult.data
      }));

      // Return success as long as the main email was sent
      if (result.error) {
        console.error('[send-poem] Error sending main email:', result.error);
        return createErrorResponse(`Error sending email: ${result.error.message}`, 400, result.error);
      }

      const endTime = new Date();
      const executionTime = endTime.getTime() - startTime.getTime();
      console.log(`[send-poem] Function completed in ${executionTime}ms`);

      return createSuccessResponse({
        id: result.data?.id,
        adminCopySent: !adminResult.error
      });
    } catch (sendError) {
      console.error('[send-poem] Exception while calling Resend API:', sendError);
      return createErrorResponse(`Exception calling Resend API: ${sendError.message}`, 500, {
        stack: sendError.stack
      });
    }
  } catch (error) {
    console.error('[send-poem] Unhandled error:', error.message, error.stack);
    return createErrorResponse(`Unhandled server error: ${error.message}`, 500, {
      stack: error.stack
    });
  }
});
