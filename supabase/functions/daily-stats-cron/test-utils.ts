
/**
 * Tests the email function execution with a direct API call
 */
export async function testEmailFunction(supabaseUrl: string, supabaseKey: string) {
  try {
    console.log("[daily-stats-cron] Testing email function execution...");
    const testResult = await fetch(`${supabaseUrl}/functions/v1/daily-stats-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ test: true })
    });
    
    const testStatus = testResult.status;
    console.log("[daily-stats-cron] Test API call status:", testStatus);
    
    let testResponse;
    try {
      testResponse = await testResult.json();
      console.log("[daily-stats-cron] Test email execution result:", testResponse);
      return testResponse;
    } catch (parseError) {
      const textResponse = await testResult.text();
      console.error("[daily-stats-cron] Failed to parse JSON response:", textResponse);
      return { status: testStatus, text: textResponse };
    }
  } catch (testError) {
    console.error("[daily-stats-cron] Error testing email function:", testError);
    throw testError;
  }
}
