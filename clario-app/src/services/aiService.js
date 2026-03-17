/**
 * AI Service for CLARIO Academic Platform.
 * Supports both real LLM API integration and mock fallbacks.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'gemini';

/**
 * Call Gemini API using fetch
 */
const callGemini = async (promptId, inputData) => {
  if (!API_KEY || API_KEY.includes('your_')) {
    throw new Error("Gemini API Key not set. Falling back to mock.");
  }

  // Construct a specific prompt based on promptId
  const systemPrompt = "You are an expert academic reviewer for CLARIO Platform.";
  const userPrompt = `Analysis needed for Tool: ${promptId}. Data: ${JSON.stringify(inputData)}. Provide JSON response only.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw error;
  }
};

/**
 * Executes a specific AI prompt.
 */
export const executePrompt = async (promptId, inputData) => {
  console.log(`Executing AI Prompt ${promptId} with:`, inputData);
  
  // Try real API first
  if (PROVIDER === 'gemini') {
    try {
      return await callGemini(promptId, inputData);
    } catch (error) {
      console.warn("Real AI Brain failed, using simulation:", error.message);
    }
  }

  // Fallback to Simulation (Phase 5 Logic)
  await new Promise(resolve => setTimeout(resolve, 2000));

  switch (promptId) {
    case '2.2': // Similar Article Finder
      return {
        articles: [
          { title: "AI in Academic Writing: A Meta-Analysis", author: "Smith et al.", year: 2024, journal: "Nature", similarity: 0.85 },
          { title: "Large Language Models for Research Assistance", author: "Jones & Wang", year: 2023, journal: "IEEE Access", similarity: 0.78 }
        ]
      };
    
    case '2.3': // Over-claim Detector
      return {
        findings: [
          { sentence: "This method completely proves the hypothesis.", issue: "Over-claim: 'completely proves'", suggestion: "This method strongly suggests/supports the hypothesis." }
        ]
      };

    case '2.4': // Methodology Critic
      return {
        critique: "The sample size (n=30) is quite small for this type of statistical inference. Recommending a power analysis or acknowledging this as a significant limitation.",
        alternatives: ["Increase sample size", "Use robust non-parametric tests"]
      };

    default:
      return { status: "success", message: "Prompt executed (mock result)" };
  }
};
