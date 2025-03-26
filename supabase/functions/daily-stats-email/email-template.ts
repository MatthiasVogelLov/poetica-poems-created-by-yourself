
/**
 * Email template utilities for the daily statistics email
 */

/**
 * Generates HTML for the daily statistics email
 */
export function generateEmailHtml(
  yesterdayFormatted: string,
  totalPoems: number,
  keywordsUsed: number,
  audienceRows: string,
  occasionRows: string
): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4a5568; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Poetica Tagesstatistik</h1>
        
        <p>Hier ist die Statistik für <strong>${yesterdayFormatted}</strong>:</p>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h2 style="color: #4a5568; margin-top: 0;">Übersicht</h2>
          <p><strong>Erstellte Gedichte:</strong> ${totalPoems}</p>
          <p><strong>Mit Schlüsselwörtern:</strong> ${keywordsUsed} (${totalPoems > 0 ? Math.round((keywordsUsed / totalPoems) * 100) : 0}%)</p>
        </div>
        
        <div style="margin-bottom: 24px;">
          <h2 style="color: #4a5568;">Zielgruppen</h2>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Zielgruppe</th>
                <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Anzahl</th>
              </tr>
            </thead>
            <tbody>
              ${audienceRows}
            </tbody>
          </table>
        </div>
        
        <div>
          <h2 style="color: #4a5568;">Anlässe</h2>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Anlass</th>
                <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Anzahl</th>
              </tr>
            </thead>
            <tbody>
              ${occasionRows}
            </tbody>
          </table>
        </div>
        
        <p style="margin-top: 24px; font-size: 0.9em; color: #718096;">
          Dies ist eine automatisch generierte E-Mail von Poetica. Tagesstatistik für ${yesterdayFormatted}, generiert am ${new Date().toISOString()}.
        </p>
      </body>
    </html>
  `;
}

/**
 * Formats audience data into HTML table rows
 */
export function formatAudienceRows(audienceData: any[]): string {
  return audienceData
    .map(item => `<tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.audience || 'Unbekannt'}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.today || 0}</td>
    </tr>`)
    .join('');
}

/**
 * Formats occasion data into HTML table rows
 */
export function formatOccasionRows(occasionData: any[]): string {
  return occasionData
    .map(item => `<tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.occasion || 'Unbekannt'}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.today || 0}</td>
    </tr>`)
    .join('');
}
