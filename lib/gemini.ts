/**
 * Utility for executing Gemini API calls with diagnostic trapping and exponential backoff.
 */

export interface GeminiCallOptions {
  model: string;
  url: string;
}

/**
 * Startup or pre-flight check to verify environmental settings and target endpoint.
 */
export function preflightGeminiCheck(): void {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = process.env.GEMINI_BASE_URL || process.env.OPENAI_BASE_URL || "https://generativelanguage.googleapis.com";

  console.log("\n--- PRE-FLIGHT GEMINI CONFIGURATION CHECK ---");
  if (geminiKey) {
    const maskedKey = geminiKey.length >= 6 ? `${geminiKey.substring(0, 6)}...` : geminiKey;
    console.log(`Active API Key (first 6 chars): ${maskedKey}`);
  } else {
    console.log("Active API Key: NOT FOUND in environment variables.");
  }

  if (baseUrl.includes("googleapis.com")) {
    console.log("Endpoint Confirmation: GLOBAL wrapper endpoint (googleapis.com) is being targeted.");
  } else {
    const isRegional = baseUrl.includes("aiplatform") || (baseUrl.includes("googleapis.com") && /(us|europe|asia)-/.test(baseUrl));
    if (isRegional) {
      console.log("Endpoint Confirmation: WARNING: Explicit REGIONAL cloud endpoint is being targeted.");
    } else {
      console.log(`Endpoint Confirmation: Non-Google endpoint or custom endpoint: ${baseUrl}`);
    }
  }
  console.log("---------------------------------------------\n");
}

/**
 * Wraps any promise-based Gemini API call with diagnostic trapping,
 * 429-specific retry logic with exponential backoff + jitter.
 */
export async function callGeminiWithRetry<T>(
  apiCallFn: () => Promise<T>,
  options: GeminiCallOptions
): Promise<T> {
  const maxRetries = 3;
  let attempt = 0;

  while (true) {
    attempt++;
    try {
      const result = await apiCallFn();
      if (attempt > 1) {
        console.log(`DEBUG: 429 resolved by backoff retry #[${attempt - 1}]`);
      }
      return result;
    } catch (error: any) {
      const statusCode = error.status || error.statusCode || error.response?.status || error.code;
      const errorBody = error.response?.data || error.body || error.message || "";
      const rawResponseStr = typeof errorBody === "object" ? JSON.stringify(errorBody) : String(errorBody);

      // Advanced Diagnostic Logging Wrapper
      console.error("\n=== GEMINI API ERROR DIAGNOSTICS ===");
      console.error(`Model Requested: ${options.model}`);
      console.error(`Target Endpoint: ${options.url}`);
      console.error(`HTTP Status Code: ${statusCode || "UNKNOWN"}`);
      console.error(`Raw Response: ${rawResponseStr}`);

      const containsLimitZero = rawResponseStr.includes('"limit": 0') || rawResponseStr.includes('"limit":0') || rawResponseStr.includes('limit: 0') || rawResponseStr.includes('limit:0');
      const containsQuotaLimit = rawResponseStr.toLowerCase().includes("quota_limit");

      console.error(`Contains 'limit: 0': ${containsLimitZero}`);
      console.error(`Contains 'quota_limit': ${containsQuotaLimit}`);
      console.error("====================================\n");

      // Strictly check if the error is 429
      const is429 = statusCode === 429 || rawResponseStr.includes("429") || error.message?.includes("429");

      if (is429 && attempt <= maxRetries) {
        // Exponential backoff: 2s, 4s, 8s plus random jitter between 0 and 1000ms
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        console.warn(`[Retry ${attempt}/${maxRetries}] Hit 429 Resource Exhausted. Retrying in ${(delay / 1000).toFixed(2)}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Throw if not a 429 or if we ran out of retry attempts
      throw error;
    }
  }
}
